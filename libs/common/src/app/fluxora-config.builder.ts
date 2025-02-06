import merge from "lodash.merge";

import { createServer } from "node:net";
import { basename, resolve } from "node:path";

import { glob } from "glob";

import {
  AppType,
  type CreateServerOptions,
  type FluxoraConfig,
  type FluxoraConfigMethods,
  type MicroApp,
  type MicroAppHost,
  type MicroApplication,
  type PartialFluxoraConfig,
  type UserConfig
} from "@fluxora/types/core";
import { AsyncTask } from "@fluxora/utils";

import { logger } from "../utils/logger";

export class FluxoraConfigBuilder extends AsyncTask {
  private readonly fluxoraConfig: PartialFluxoraConfig = {};
  private readonly definedPorts = new Set<number>();
  private startingPort = 32768;

  constructor(
    private readonly userConfig: UserConfig,
    private readonly serverOptions?: CreateServerOptions
  ) {
    super();
    this.fluxoraConfig.server = this.serverOptions;
  }

  get resolvedUserConfig() {
    return this.userConfig;
  }

  static fromPrevConfig(prevConfig: FluxoraConfig): FluxoraConfigBuilder {
    const configBuilder = new FluxoraConfigBuilder({});
    Object.assign(configBuilder.fluxoraConfig, prevConfig);
    return configBuilder;
  }

  resolveTemplate() {
    this.fluxoraConfig.apps ||= [];
    this.fluxoraConfig.apps.push({
      type: AppType.LIBRARY,
      name: "template::template",
      root: resolve(process.cwd(), "template")
    });

    return this;
  }

  resolveApps() {
    const appsRelativeRoot = "apps";
    const appsRoot = resolve(process.cwd(), appsRelativeRoot);
    const apps = glob.sync(`${appsRoot}/*`, { absolute: true });

    const hostAppName = this.userConfig.hostAppName;

    this.addTask(async () => {
      const appList = await Array.fromAsync(
        apps.map<Promise<MicroApplication>>(async app => ({
          type: AppType.APPLICATION,
          root: app,
          isHost: !!hostAppName && app.endsWith(hostAppName),
          name: `app::${basename(app)}`,
          host: await this.resolveHostForApp()
        }))
      );

      this.fluxoraConfig.apps ||= [];
      this.fluxoraConfig.apps.push(...appList);
    });

    return this;
  }

  resolveCacheOptions() {
    this.fluxoraConfig.fluxoraRoot = this.userConfig.cache?.root || resolve(process.cwd(), ".fluxora");
    return this;
  }

  resolveOutputOptions() {
    this.fluxoraConfig.outDirRoot = resolve(process.cwd(), this.userConfig.build?.root || "build");
    return this;
  }

  async build() {
    await this.executeTasks();
    if (!this.validateConfig()) process.exit(1);

    const conf = this.fluxoraConfig as FluxoraConfig;

    const fluxoraConfigMethods: FluxoraConfigMethods = {
      async withApps(fn) {
        // const hostApp = conf.apps.find(app => app.isHost)!;
        for (const app of conf.apps) {
          //   if (app.isHost) {
          //     continue;
          //   }
          await fn(app);
        }
      },
      getRawConfig() {
        return Object.assign({}, conf, { __raw: true as true });
      }
    };

    return merge({}, conf, fluxoraConfigMethods);
  }

  private validateConfig() {
    if (!this.fluxoraConfig.apps?.length) {
      logger.error("No apps found in the apps directory");
      return false;
    }

    let hostApp: MicroApp | undefined;
    // for (const app of this.fluxoraConfig.apps) {
    //   if (!app.host?.host) {
    //     logger.error(`Host for app ${app.name} is not defined`);
    //     return false;
    //   }
    //
    //   if (app.isHost) {
    //     if (hostApp) {
    //       logger.error(`Multiple host apps found: ${hostApp.name}, ${app.name}`);
    //       return false;
    //     }
    //     hostApp = app;
    //   }
    // }

    if (!hostApp) {
      logger.error("Host app not found");
      return false;
    }

    return true;
  }

  private async resolveHostForApp(): Promise<MicroAppHost> {
    const host = `http://localhost:${await this.getNextPort()}`;
    const devWsPort = await this.getNextPort();

    return { host, devWsPort };
  }

  private async getNextPort() {
    let port = this.startingPort;
    while (!this.definedPorts.has(port) && !(await this.isPortAvailable(port))) {
      port++;
    }
    this.startingPort = port + 1;
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
