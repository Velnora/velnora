import { Server } from "node:http";
import { resolve } from "node:path";

import { type InlineConfig, type ViteDevServer, createServer, isRunnableDevEnvironment } from "vite";
import inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

import type { INestApplication } from "@nestjs/common";
import { Emojis } from "@velnora/logger";
import type { WithDefault } from "@velnora/types";
import { BaseClass, ClassExtensions, ClassGetterSetter, VIRTUAL_ENTRIES } from "@velnora/utils";
import { PROJECT_CWD, swcPlugin } from "@velnora/utils/node";

import { velnoraAppPlugin } from "../../plugins/velnora-app.plugin";
import { adapterEntry } from "../../utils/adapter-entry";
import { logger } from "../../utils/logger/logger";
import { adapterRegistry } from "../adapter";
import { RegisteredApp, appCtx } from "../app-ctx";
import { environmentRegistry } from "../environment";
import { frameworkRegistry } from "../framework";

declare const __DEV__: boolean;

enum AppState {
  STARTING = "starting",
  STARTED = "started",
  STOPPED = "stopped",
  LISTENING = "listening"
}

@ClassExtensions()
export class Entity extends BaseClass {
  @ClassGetterSetter(AppState.STOPPED)
  declare state: AppState;

  private serverApp: INestApplication = null!;

  constructor(readonly app: RegisteredApp) {
    super();
  }

  get adapterContext() {
    return adapterRegistry.use(this.app.config.adapter, this.app);
  }

  get environmentContext() {
    return environmentRegistry.use(this.app.config.environment.runtime, this.app);
  }

  get appFrameworkContext() {
    return frameworkRegistry.use(this.app.config.framework, this.app);
  }

  get templateFrameworkContext() {
    const appTemplate = appCtx.projectStructure.template.getModule(this.app.config.template);

    if (this.app.config.framework !== appTemplate.config.framework) {
      return frameworkRegistry.use(appTemplate.config.framework, this.app);
    }

    return this.appFrameworkContext;
  }

  private _vite?: ViteDevServer;

  get vite() {
    if (!this._vite) {
      // ToDo: Handle error
      throw new Error("Vite server is not initialized");
    }
    return this._vite;
  }

  get viteRunner() {
    const environment = this.vite.environments.ssr;
    if (!isRunnableDevEnvironment(environment)) {
      // ToDo: Handle error
      throw new Error("SSR environment is not runnable");
    }
    return environment;
  }

  private _server?: Server;

  get server() {
    if (!this._server)
      this._server = this.environmentContext.createServer((req, res) => this.adapterContext.server.instance(req, res));
    return this._server;
  }

  get isHost() {
    return appCtx.projectStructure.apps.hostAppName === this.app.name;
  }

  async start() {
    await this.prepare();

    this.checkIfAppRunning();

    this.state = AppState.STARTING;
    await this.injectServer();
    await this.injectClient();
    this.state = AppState.STARTED;

    const listenPromise = Promise.withResolvers<void>();
    this.server.listen(this.vite.config.server.port, () => {
      logger.success(
        Emojis.ready,
        `Application (${this.app.name}) started at http://localhost:${this.vite.config.server.port}`
      );
      listenPromise.resolve();
    });
    await listenPromise.promise;
    this.state = AppState.LISTENING;
  }

  updateServerApp() {
    this.viteRunner.runner.evaluatedModules.invalidateModule(
      this.viteRunner.runner.evaluatedModules.getModuleById(VIRTUAL_ENTRIES.APP_SERVER_ENTRY(this.app.name))!
    );
    this.viteRunner.runner
      .import<WithDefault<INestApplication>>(VIRTUAL_ENTRIES.APP_SERVER_ENTRY(this.app.name))
      .then(({ default: newServerApp }) => (this.serverApp = newServerApp));
  }

  private async prepare() {
    logger.info(Emojis.prepare, `Preparing app "${this.app.name}"...`);

    const appTemplate = appCtx.projectStructure.template.getModule(this.app.config.template);
    await Promise.all([
      frameworkRegistry.registerSilent(this.app.config.framework),
      frameworkRegistry.registerSilent(appTemplate.config.framework),
      adapterRegistry.registerSilent(this.app.config.adapter),
      environmentRegistry.registerSilent(this.app.config.environment.runtime)
    ]);

    this.environmentContext.checkEnvironment(this.app);

    this._vite = await createServer(await this.viteOptions());
    this.adapterContext.server.use(this.vite.middlewares);
  }

  private async injectClient() {
    logger.debug(Emojis.debug, `Injecting client for app "${this.app.name}"...`);

    this.adapterContext.server.use(await adapterEntry(this));
  }

  private async injectServer() {
    logger.debug(Emojis.debug, `Injecting server for app "${this.app.name}"...`);

    const versionNumber = 1;
    const prefix = `/api/v${versionNumber}/${this.app.name}`;
    logger.debug(Emojis.register, `Registering API prefix "${prefix}" for app "${this.app.name}"`);

    const { default: serverApp } = await this.viteRunner.runner.import<WithDefault<INestApplication>>(
      VIRTUAL_ENTRIES.APP_SERVER_ENTRY(this.app.name)
    );
    this.serverApp = serverApp;

    this.adapterContext.server.use(prefix, async (req, res, next) => {
      const url = req.url?.replace(/\/$/, "") || "";
      req.url = `${prefix}${url}`;
      const instance = this.serverApp.getHttpAdapter().getInstance();
      instance(req, res, next);
    });
  }

  private checkIfAppRunning() {
    if (this.state !== AppState.STOPPED) {
      const possibleListening = this.state === AppState.LISTENING ? " and listening" : "";
      throw new Error(`App "${this.app.name}" is already started${possibleListening}.`);
    }
  }

  private async viteOptions() {
    const appFrameworkPlugins = this.appFrameworkContext.plugins;
    const templateFrameworkPlugins = this.templateFrameworkContext.plugins;
    const adapterPlugins = this.adapterContext.vite.plugins;
    const plugins = new Set([
      velnoraAppPlugin(this.app),
      this.app.config.framework !== "react" && swcPlugin(),
      __DEV__ && tsconfigPaths({ root: PROJECT_CWD, loose: true }),
      process.env.NODE_ENV === "development" && inspect(),
      ...(appFrameworkPlugins || []),
      ...(templateFrameworkPlugins || []),
      ...(adapterPlugins || [])
    ]);

    return {
      root: process.cwd(),
      mode: process.env.NODE_ENV || "production",
      plugins: Array.from(plugins),
      esbuild: false,
      server: {
        middlewareMode: true,
        hmr: { server: this.server },
        port: await appCtx.server.nextAvailablePort()
      },
      cacheDir: resolve(process.cwd(), appCtx.cache.root, "apps", this.app.name, ".vite"),
      clearScreen: false,
      logLevel: "silent",
      appType: "custom"
    } satisfies InlineConfig;
  }
}
