import merge from "lodash.merge";

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import {
  AppType,
  type FluxoraApp,
  type FluxoraAppConfig,
  type FluxoraAppConfigMethods,
  type FluxoraConfig,
  type FluxoraConfigMethods,
  type FluxoraRawConfig,
  type MicroApp,
  type PartialFluxoraAppConfig,
  type UserAppConfig,
  type UserConfig
} from "@fluxora/types/core";
import { AsyncTask, ErrorMessages, FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT } from "@fluxora/utils";

import { logger } from "../utils/logger";

export class FluxoraAppConfigBuilder extends AsyncTask {
  private readonly config: PartialFluxoraAppConfig = {};

  constructor(
    private readonly app: MicroApp,
    private readonly fluxoraConfig: FluxoraRawConfig | (FluxoraConfig & FluxoraConfigMethods),
    private readonly userConfig: UserConfig,
    private readonly userAppConfig: UserAppConfig
  ) {
    super();
    this.config.app = this.app;
    this.config.exposedModules = new Map();
  }

  setRemoteEntry() {
    this.config.remoteEntry = {
      entryPath:
        this.userConfig?.configs?.[this.app.name]?.remoteEntryPath ||
        this.userAppConfig?.remoteEntryPath ||
        FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT
    };
    return this;
  }

  retrieveViteConfigFile() {
    this.config.vite ||= {};

    let resolvedConfigFile: string;
    if (this.userAppConfig.vite?.configFile) {
      this.config.vite.configFile = resolve(this.userAppConfig.vite.configFile);
    } else if (existsSync((resolvedConfigFile = resolve(this.app.root, "vite.config.ts")))) {
      this.config.vite.configFile = resolvedConfigFile;
    } else if (existsSync((resolvedConfigFile = resolve(this.app.root, "vite.config.js")))) {
      this.config.vite.configFile = resolvedConfigFile;
    }

    return this;
  }

  async build() {
    await this.executeTasks();
    if (!this.validateConfig()) process.exit(1);
    const conf = this.config as FluxoraAppConfig;

    const fluxoraAppConfigMethods: FluxoraAppConfigMethods = {
      isHostApp() {
        return conf.app.type === AppType.APPLICATION && conf.app.isHost;
      }
    };

    return merge(this.fluxoraConfig, fluxoraAppConfigMethods, conf) as FluxoraApp;
  }

  checkHostForProduction(isBuild = false) {
    if (import.meta.env.PROD && isBuild && !this.userAppConfig.host) {
      logger.error(ErrorMessages.HOST_NOT_VALID_FOR_PRODUCTION);
      process.exit(1);
    }

    return this;
  }

  private validateConfig() {
    const conf = this.config;

    if (!conf.app) {
      logger.error(ErrorMessages.APP_NOT_DEFINED);
      return false;
    }

    return true;
  }
}
