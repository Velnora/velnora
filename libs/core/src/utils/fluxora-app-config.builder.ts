import merge from "lodash.merge";

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT } from "../const";
import type {
  FluxoraApp,
  FluxoraAppConfig,
  FluxoraConfig,
  MicroApp,
  PartialFluxoraAppConfig,
  ResolvedUserAppConfig,
  ResolvedUserConfig
} from "../types";
import { AsyncTask } from "./async-task";
import { logger } from "./logger";
import { resolveUserAppConfig } from "./resolve-user-app-config";
import { resolveUserConfig } from "./resolve-user-config";

export class FluxoraAppConfigBuilder extends AsyncTask {
  private readonly config: PartialFluxoraAppConfig = {};

  constructor(
    private readonly fluxoraConfig: FluxoraConfig,
    private readonly userConfig: ResolvedUserConfig,
    private readonly userAppConfig: ResolvedUserAppConfig,
    private readonly app: MicroApp
  ) {
    super();
    this.config.app = this.app;
    this.config.exposedModules = new Map();
  }

  static async from(app: MicroApp, fluxoraConfig: FluxoraConfig): Promise<FluxoraAppConfigBuilder> {
    const userConfig = await resolveUserConfig();
    const userAppConfig = await resolveUserAppConfig(app.name);
    return new FluxoraAppConfigBuilder(fluxoraConfig, userConfig, userAppConfig, app);
  }

  setRemoteEntry() {
    this.config.remoteEntry = {
      entryPath:
        this.userConfig?.config?.[this.app.name]?.remoteEntryPath ||
        this.userAppConfig?.remoteEntryPath ||
        FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT
    };
    return this;
  }

  retrieveViteConfigFile() {
    this.config.vite ||= {};

    let resolvedConfigFile: string;
    if (this.userConfig.vite?.configFile) {
      this.config.vite.configFile = resolve(this.userConfig.vite.configFile);
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
    if (!__DEV__ && isBuild && !this.userConfig.hosts?.[this.app.name]) {
      logger.error("Host which defined by default isn't valid for production. Please define it in fluxora.config.ts");
      process.exit(1);
    }
  }

  private validateConfig() {
    const conf = this.config;

    if (!conf.app) {
      logger.error("Current app is not defined");
      return false;
    }

    return true;
  }
}
