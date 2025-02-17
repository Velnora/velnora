import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { basename, resolve } from "node:path";
import { isMainThread } from "node:worker_threads";

import { glob } from "glob";
import type { PackageJson } from "type-fest";

import { resolveConfigFile } from "@fluxora/common";
import { AppType, type CreateServerOptions, type UserAppConfig, type UserConfig } from "@fluxora/types/core";
import { WORKER_EVENTS } from "@fluxora/types/worker";
import { AsyncTask, DEFAULT_REMOTE_ENTRY_PATH, DIRECTORY_NAMES, DeepTracker, capitalize } from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";
import { Worker, WorkerPool, WorkerProxy } from "@fluxora/utils/worker";

import type { AppsMap } from "../types/apps-map";
import { logger } from "../utils/logger";

declare global {
  var __RESOLVED_USER_CONFIG__: UserConfig;
  var __RESOLVED_USER_APP_CONFIGS__: Record<string, UserAppConfig>;
}

enum AppManagerEventTypes {
  APP_UPDATE_MAIN = "app:update:main",
  APP_UPDATE_WORKER = "app:update:worker",
  APP_DELETE_MAIN = "app:delete:main",
  APP_DELETE_WORKER = "app:delete:worker",
  MANAGER_INIT = "app-manager:init"
}

export interface AppManagerEvents {
  [AppManagerEventTypes.APP_UPDATE_MAIN]: { path: string; value: any };
  [AppManagerEventTypes.APP_UPDATE_WORKER]: { path: string; value: any };
  [AppManagerEventTypes.APP_DELETE_MAIN]: { path: string };
  [AppManagerEventTypes.APP_DELETE_WORKER]: { path: string };
  [AppManagerEventTypes.MANAGER_INIT]: AppsMap;
}

export class AppManager {
  private startPort?: number = undefined;

  private definedPorts = new Set<number>();
  private asyncTask = new AsyncTask();

  private deepTracker = new DeepTracker<AppsMap>({
    [AppType.APPLICATION]: {},
    [AppType.LIBRARY]: {},
    [AppType.TEMPLATE]: {}
  });

  private get appsMap() {
    return this.deepTracker.proxy();
  }

  init(options?: CreateServerOptions) {
    this.startPort = (options?.port || 32767) + 1;
  }

  communicateWithWorkers(workerProxy: WorkerProxy<AppManagerEvents>, pool: WorkerPool<any, AppManagerEvents>): void;
  communicateWithWorkers(worker: Worker<any, AppManagerEvents>): Promise<void>;
  communicateWithWorkers(
    worker: WorkerProxy<AppManagerEvents> | Worker<any, AppManagerEvents>,
    pool?: WorkerPool<any, AppManagerEvents>
  ): void | Promise<void> {
    if (isMainThread && worker instanceof WorkerProxy) {
      worker.on(WORKER_EVENTS.INITIALIZED, () => {
        worker.emit(AppManagerEventTypes.MANAGER_INIT, this.appsMap);
      });

      this.deepTracker
        .on("change", (path, value) => {
          worker.emit(AppManagerEventTypes.APP_UPDATE_WORKER, { path, value });
        })
        .on("delete", path => {
          worker.emit(AppManagerEventTypes.APP_DELETE_WORKER, { path });
        });

      worker
        .on(AppManagerEventTypes.APP_UPDATE_MAIN, ({ path, value }) => {
          pool
            ?.proxy()
            .filter(w => w !== worker)
            .forEach(w => w.emit(AppManagerEventTypes.APP_UPDATE_WORKER, { path, value }));
          this.deepTracker.set(path, value);
        })
        .on(AppManagerEventTypes.APP_DELETE_MAIN, ({ path }) => {
          pool
            ?.proxy()
            .filter(w => w !== worker)
            .forEach(w => w.emit(AppManagerEventTypes.APP_DELETE_WORKER, { path }));
          this.deepTracker.delete(path);
        });
    }

    if (!isMainThread && worker instanceof Worker) {
      const { promise, resolve } = Promise.withResolvers<void>();

      worker
        .once(AppManagerEventTypes.MANAGER_INIT, map => {
          this.deepTracker.setObject(map);
          resolve();
        })
        .on(AppManagerEventTypes.APP_UPDATE_WORKER, ({ path, value }) => this.deepTracker.set(path, value))
        .on(AppManagerEventTypes.APP_DELETE_WORKER, ({ path }) => this.deepTracker.delete(path));

      this.deepTracker.on("change", (path, value) => {
        worker.emit(AppManagerEventTypes.APP_UPDATE_MAIN, { path, value });
      });
      this.deepTracker.on("delete", path => worker.emit(AppManagerEventTypes.APP_DELETE_MAIN, { path }));

      return promise;
    }
  }

  async resolveUserConfig() {
    if (globalThis.__RESOLVED_USER_CONFIG__) return globalThis.__RESOLVED_USER_CONFIG__;

    const configFileName = ["fluxora.config.js", "fluxora.config.ts"].find(configFileName =>
      existsSync(resolve(process.cwd(), configFileName))
    );

    if (!configFileName) return (globalThis.__RESOLVED_USER_CONFIG__ = {});
    const configFilePath = resolve(process.cwd(), configFileName);
    return (globalThis.__RESOLVED_USER_CONFIG__ = (await resolveConfigFile(configFilePath)) || {});
  }

  async resolveUserAppConfig(appName: string) {
    globalThis.__RESOLVED_USER_APP_CONFIGS__ ||= {};
    if (globalThis.__RESOLVED_USER_APP_CONFIGS__[appName]) return globalThis.__RESOLVED_USER_APP_CONFIGS__[appName];

    const configFileName = ["fluxora.config.js", "fluxora.config.ts"].find(configFileName =>
      existsSync(resolve(process.cwd(), "apps", appName, configFileName))
    );
    if (!configFileName) return (globalThis.__RESOLVED_USER_APP_CONFIGS__[appName] = {});
    const configFilePath = resolve(process.cwd(), "apps", appName, configFileName);
    return (globalThis.__RESOLVED_USER_APP_CONFIGS__[appName] = (await resolveConfigFile(configFilePath)) || {});
  }

  async resolvePackages(isBuild = false) {
    if (!this.startPort && !isBuild) {
      logger.error("Port not initialized. Please make sure to call init() before calling resolvePackages.");
      process.exit(1);
    }

    const pkgJsonFs = projectFs.packageJson;
    if (!existsSync(pkgJsonFs.$raw)) {
      logger.error("No package.json found. Please make sure to have a package.json in your workspace");
      process.exit(1);
    }
    const pkgJson = await pkgJsonFs.readJson<PackageJson>();
    const workspaces = Array.isArray(pkgJson.workspaces) ? pkgJson.workspaces : pkgJson.workspaces?.packages || [];
    const appLibMap = workspaces.flatMap(ws => glob.sync(ws, { cwd: pkgJsonFs.dirname() }));

    if (!appLibMap.length) {
      logger.error("No workspaces found. Please make sure to your app is a workspace");
      process.exit(1);
    }

    const { non } = appLibMap.reduce(
      (acc, appLib) => {
        if (DIRECTORY_NAMES.APP.some(appDir => appLib.startsWith(appDir))) {
          this.asyncTask.addTask(async () => {
            await this.addApp(appLib, isBuild);
          });
        } else if (DIRECTORY_NAMES.LIB.some(libDir => appLib.startsWith(libDir))) {
          this.asyncTask.addTask(async () => {
            await this.addLib(appLib);
          });
        } else if (DIRECTORY_NAMES.TEMPLATE.some(templateDir => appLib === templateDir)) {
          this.asyncTask.addTask(async () => {
            await this.addTemplate(appLib);
          });
        } else {
          acc.non.push(appLib);
        }

        return acc;
      },
      { non: [] } as Record<"non", string[]>
    );

    if (non.length > 0) {
      logger.debug("Found non-standard directories in workspaces:", { nonStandard: non });

      logger.warn(
        `Found non-standard directories in workspaces: ${non.join(", ")}. Please make sure to follow the standard directory structure.`
      );
    }
    await this.asyncTask.executeTasks();

    logger.debug("Registered packages (apps, libs, templates):", this.appsMap);
  }

  getTemplateApp() {
    const templates = this.appsMap[AppType.TEMPLATE];
    const keys = Object.keys(templates);
    if (!templates || keys.length === 0) {
      logger.error("No templates found. Please make sure to add a template to your workspaces");
      process.exit(1);
    }
    if (keys.length > 1) {
      logger.error("Multiple templates found. Please make sure to have only one template in your workspaces");
      process.exit(1);
    }
    return templates[keys[0]];
  }

  getApps() {
    return Object.values(this.appsMap[AppType.APPLICATION]);
  }

  getApp(name: string) {
    return this.appsMap[AppType.APPLICATION][name];
  }

  getAppOrThrow(name: string) {
    const app = this.getApp(name);
    if (!app) {
      logger.error(`App "${name}" not found`);
      process.exit(1);
    }
    return app;
  }

  getLibs() {
    return Object.values(this.appsMap[AppType.LIBRARY]);
  }

  getLib(name: string) {
    return this.appsMap[AppType.LIBRARY][name];
  }

  private async addApp(appPath: string, isBuild: boolean) {
    const appName = appPath.split("/").slice(1).join("/");
    const resolvedConfig = await this.resolveUserConfig();
    const pkgJson = await projectFs.app(appPath.split("/").slice(1).join("/")).packageJson.readJson<PackageJson>();

    this.appsMap[AppType.APPLICATION][appName] = {
      type: AppType.APPLICATION,
      root: resolve(appPath),
      name: basename(appPath),
      host: isBuild ? `` : `http://localhost:${await this.getNextPort()}`,
      remoteEntry: {
        entryPath: resolvedConfig.configs?.[appPath]?.remoteEntryPath || DEFAULT_REMOTE_ENTRY_PATH
      },
      config: {
        name: basename(appPath),
        componentName: capitalize(basename(appPath)),
        exposedModules: {}
      },
      packageJson: pkgJson,
      outDirRoot: resolvedConfig.build?.outDir || "build",
      isHost: basename(appPath) === resolvedConfig.hostAppName
    };

    this.asyncTask.addTask(async () => {
      const app = this.appsMap[AppType.APPLICATION][appName]!;
      app.devWsPort = isBuild ? -1 : await this.getNextPort();
    });
  }

  private async addLib(libPath: string) {
    const libName = libPath.split("/").slice(1).join("/");
    const pkgJson = await projectFs.lib(libPath.split("/").slice(1).join("/")).packageJson.readJson<PackageJson>();

    this.appsMap[AppType.LIBRARY][libName] = {
      type: AppType.LIBRARY,
      root: resolve(libPath),
      name: basename(libPath),
      packageJson: pkgJson
    };
  }

  private async addTemplate(templatePath: string) {
    const templateName = templatePath.split("/").slice(1).join("/");
    const pkgJson = await projectFs.template.packageJson.readJson<PackageJson>();

    this.appsMap[AppType.TEMPLATE][templateName] = {
      type: AppType.TEMPLATE,
      root: resolve(templatePath),
      name: templatePath,
      packageJson: pkgJson
    };
  }

  private async getNextPort() {
    let port = this.startPort!;
    while (!this.definedPorts.has(port) && !(await this.isPortAvailable(port))) {
      port++;
    }
    this.startPort = port + 1;
    return port;
  }

  private async isPortAvailable(port: number) {
    return new Promise<boolean>(resolve => {
      const server = createServer();
      server.on("error", () => resolve(false));
      server.on("listening", () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  }
}

export const appManager = new AppManager();
