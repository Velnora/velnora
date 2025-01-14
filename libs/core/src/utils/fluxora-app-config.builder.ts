import merge from "lodash.merge";

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT } from "../const";
import type { MicroApp } from "../types";
import type { FluxoraApp, PartialFluxoraAppConfig, ResolvedUserAppConfig, ResolvedUserConfig } from "../types";
import type { FluxoraAppConfigMethods } from "../types/fluxora/fluxora-app-config-methods";
import { AsyncTask } from "./async-task";
import type { FluxoraConfigBuilder } from "./fluxora-config.builder";
import { logger } from "./logger";

export class FluxoraAppConfigBuilder extends AsyncTask {
  private readonly fluxoraAppConfig: PartialFluxoraAppConfig = {};

  constructor(
    private readonly fluxoraConfigBuilder: FluxoraConfigBuilder,
    private readonly userConfig: ResolvedUserConfig,
    private readonly userAppConfig: ResolvedUserAppConfig,
    private readonly app: MicroApp
  ) {
    super();
    this.fluxoraAppConfig.app = this.app;
    this.fluxoraAppConfig.exposedModules = new Map();
  }

  private static _availablePort = 32768;

  private get availablePort() {
    return FluxoraAppConfigBuilder._availablePort++;
  }

  assignHost(isBuild: boolean) {
    const host = this.userConfig.hosts?.[this.app.name];
    this.fluxoraAppConfig.client ||= {};
    this.fluxoraAppConfig.server ||= {};

    if (host?.match(/^https?:\/\//)) {
      logger.error("Host should not contain protocol");
      process.exit(1);
    }

    this.fluxoraAppConfig.client.host = host || `http://localhost:${this.availablePort}`;
    this.fluxoraAppConfig.server.host = host ? `api.${host}` : `http://localhost:${this.availablePort}`;

    this.addTask(async () => {
      this.fluxoraAppConfig.client ||= {};
      this.fluxoraAppConfig.server ||= {};

      if (!host && !isBuild) {
        this.fluxoraAppConfig.client.vite ||= {};
        this.fluxoraAppConfig.client.vite.wsPort = this.availablePort;
      }
    });
    return this;
  }

  setRemoteEntry() {
    this.fluxoraAppConfig.remoteEntry = {
      entryPath:
        this.userConfig?.config?.[this.app.name]?.remoteEntryPath ||
        this.userAppConfig?.remoteEntryPath ||
        FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT
    };
    return this;
  }

  retrieveViteConfigFile() {
    this.fluxoraAppConfig.vite ||= {};

    this.fluxoraAppConfig.client ||= {};
    this.fluxoraAppConfig.client.vite ||= {};

    this.fluxoraAppConfig.server ||= {};
    this.fluxoraAppConfig.server.vite ||= {};

    let resolvedConfigFile: string;
    if (this.userConfig.vite?.configFile) {
      this.fluxoraAppConfig.vite.configFile = resolve(this.userConfig.vite.configFile);
    } else if (existsSync((resolvedConfigFile = resolve(this.app.root, "vite.config.ts")))) {
      this.fluxoraAppConfig.vite.configFile = resolvedConfigFile;
    } else if (existsSync((resolvedConfigFile = resolve(this.app.root, "vite.config.js")))) {
      this.fluxoraAppConfig.vite.configFile = resolvedConfigFile;
    }

    return this;
  }

  async build() {
    await this.executeTasks();
    if (!this.validateConfig()) process.exit(1);
    const self = this;
    const fluxoraConfig = await this.fluxoraConfigBuilder.build();
    const methods: FluxoraAppConfigMethods = {
      async getOtherAppConfig(app: MicroApp) {
        return (await self.fluxoraConfigBuilder.getAppConfig(app.name)?.build()) || null;
      }
    };
    return merge(fluxoraConfig, this.fluxoraAppConfig, methods) as FluxoraApp;
  }

  checkHostForProduction(isBuild = false) {
    if (!__DEV__ && isBuild && !this.userConfig.hosts?.[this.app.name]) {
      logger.error("Host which defined by default isn't valid for production. Please define it in fluxora.config.ts");
      process.exit(1);
    }
  }

  private validateConfig() {
    const conf = this.fluxoraAppConfig;

    if (!conf.app) {
      logger.error("Current app is not defined");
      return false;
    }

    if (!conf.client?.host) {
      logger.error("Current app's client host is not defined");
      return false;
    }

    if (!conf.server?.host) {
      logger.error("Current app's server host is not defined");
      return false;
    }

    return true;
  }
}
