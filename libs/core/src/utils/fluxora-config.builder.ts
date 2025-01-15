import merge from "lodash.merge";

import { createServer } from "node:net";
import { basename, resolve } from "node:path";

import { glob } from "glob";

import type {
  FluxoraConfig,
  FluxoraConfigMethods,
  MicroAppHost,
  PartialFluxoraConfig,
  ResolvedUserConfig
} from "../types";
import { AsyncTask } from "./async-task";
import { logger } from "./logger";

export class FluxoraConfigBuilder extends AsyncTask {
  private readonly fluxoraConfig: PartialFluxoraConfig = {};
  private readonly definedPorts = new Set<number>();
  private startingPort = 32768;

  constructor(private readonly userConfig: ResolvedUserConfig) {
    super();
    this.fluxoraConfig.resolvedUserConfig = this.userConfig;
  }

  get resolvedUserConfig() {
    return this.userConfig;
  }

  static from(userConfig: ResolvedUserConfig) {
    return new FluxoraConfigBuilder(userConfig);
  }

  resolveTemplate() {
    this.fluxoraConfig.template ||= {};
    this.fluxoraConfig.template.root = resolve(process.cwd(), "template");
    return this;
  }

  resolveApps() {
    const appsRelativeRoot = this.userConfig.apps?.root || "apps";
    const appsRoot = resolve(process.cwd(), appsRelativeRoot);
    const apps = glob.sync(`${appsRoot}/*`, { absolute: true });

    this.addTask(async () => {
      this.fluxoraConfig.apps = await Promise.all(
        apps.map(async app => ({ root: app, name: basename(app), host: await this.resolveHostForApp() }))
      );
    });

    return this;
  }

  retrieveCacheOptions() {
    this.fluxoraConfig.cacheRoot = this.userConfig.cache?.root || resolve(process.cwd(), ".fluxora");
    return this;
  }

  async build() {
    await this.executeTasks();
    if (!this.validateConfig()) process.exit(1);

    const conf = this.fluxoraConfig as FluxoraConfig;

    const fluxoraConfigMethods: FluxoraConfigMethods = {
      async withApps(fn) {
        for (const app of conf.apps) {
          await fn(app);
        }
      },
      getRawConfig() {
        return conf;
      }
    };

    return merge({}, conf, fluxoraConfigMethods);
  }

  private validateConfig() {
    if (!this.fluxoraConfig.apps?.length) {
      logger.error("No apps found in the apps directory");
      return false;
    }

    // ForEachApp
    /*
    *
    if (!conf.client?.host) {
      logger.error("Current app's client host is not defined");
      return false;
    }

    if (!conf.server?.host) {
      logger.error("Current app's server host is not defined");
      return false;
    }
    * */

    return true;
  }

  private async resolveHostForApp(): Promise<MicroAppHost> {
    const clientHost = `http://localhost:${await this.getNextPort()}`;
    const serverHost = `http://localhost:${await this.getNextPort()}`;
    const devWsPort = await this.getNextPort();

    return { clientHost, serverHost, devWsPort };
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
