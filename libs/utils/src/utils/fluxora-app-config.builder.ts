import merge from "lodash.merge";

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type {
  FluxoraApp,
  FluxoraAppConfig,
  FluxoraConfig,
  MicroApp,
  PartialFluxoraAppConfig,
  UserAppConfig,
  UserConfig
} from "@fluxora/types/core";

import { FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT } from "../const";
import { ErrorMessages } from "../helpers/error-messages";
import { AsyncTask } from "./async-task";
import { logger } from "./logger";
import { resolveUserAppConfig } from "./resolve-user-app-config";
import { resolveUserConfig } from "./resolve-user-config";

export class FluxoraAppConfigBuilder extends AsyncTask {
  private readonly config: PartialFluxoraAppConfig = {};

  private constructor(
    private readonly fluxoraConfig: FluxoraConfig,
    private readonly userConfig: UserConfig,
    private readonly userAppConfig: UserAppConfig,
    private readonly app: MicroApp
  ) {
    super();
    this.config.app = this.app;
    this.config.exposedModules = new Map();
  }

  static async from(app: MicroApp, fluxoraConfig: FluxoraConfig): Promise<FluxoraAppConfigBuilder> {
    const userConfig = await resolveUserConfig();
    const userAppConfig = await resolveUserAppConfig(app.name);
    const resolvedUserAppConfig = merge(userConfig.configs?.[app.name], userAppConfig);
    return new FluxoraAppConfigBuilder(fluxoraConfig, userConfig, resolvedUserAppConfig, app);
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
    return merge(this.fluxoraConfig, conf) as FluxoraApp;
  }

  checkHostForProduction(isBuild = false) {
    if (import.meta.env.PROD && isBuild && !this.userAppConfig.host) {
      logger.error(ErrorMessages.HOST_NOT_VALID_FOR_PRODUCTION);
      process.exit(1);
    }
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
