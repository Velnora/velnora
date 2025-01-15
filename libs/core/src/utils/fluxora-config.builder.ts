import merge from "lodash.merge";

import { basename, resolve } from "node:path";

import { glob } from "glob";

import type {
  FluxoraApp,
  FluxoraConfig,
  FluxoraConfigMethods,
  PartialFluxoraConfig,
  ResolvedUserConfig
} from "../types";
import { AsyncTask } from "./async-task";
import { FluxoraAppConfigBuilder } from "./fluxora-app-config.builder";
import { logger } from "./logger";
import { resolveUserAppConfig } from "./resolve-user-app-config";

export class FluxoraConfigBuilder extends AsyncTask {
  private readonly fluxoraConfig: PartialFluxoraConfig = {};
  private readonly appConfigurationBuilders = new Map<string, FluxoraAppConfigBuilder>();
  private readonly appConfigurations = new Map<string, FluxoraApp>();

  constructor(private readonly userConfig: ResolvedUserConfig) {
    super();
    this.fluxoraConfig.resolvedUserConfig = this.userConfig;
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
    this.fluxoraConfig.apps = apps.map(app => ({ root: app, name: basename(app) }));

    return this;
  }

  retrieveCacheOptions() {
    this.fluxoraConfig.cacheRoot = this.userConfig.cache?.root || resolve(process.cwd(), ".fluxora");
    return this;
  }

  getAppConfigBuilder(app: string) {
    if (!this.appConfigurationBuilders.has(app)) return null;
    const appConfig = this.appConfigurationBuilders.get(app);
    if (!appConfig) return null;
    return appConfig;
  }

  getAppConfig(app: string) {
    if (!this.appConfigurations.has(app)) return null;
    const appConfig = this.appConfigurations.get(app);
    if (!appConfig) return null;
    return appConfig;
  }

  setAppConfig(app: string, config: FluxoraApp) {
    this.appConfigurations.set(app, config);
  }

  async build() {
    await this.executeTasks();
    if (!this.validateConfig()) process.exit(1);

    const self = this;
    const conf = this.fluxoraConfig as FluxoraConfig;
    const appConfigurations = this.appConfigurationBuilders;

    const fluxoraConfigMethods: FluxoraConfigMethods = {
      async configureApps(fn) {
        await Promise.all(conf.apps.map(async app => fn(await fluxoraConfigMethods.getAppConfigBuilder(app))));
      },
      async getAppConfigBuilder(app) {
        if (appConfigurations.has(app.name)) return appConfigurations.get(app.name)!;
        const userAppConfig = await resolveUserAppConfig(app.name);
        const appConfig = new FluxoraAppConfigBuilder(self, self.userConfig, userAppConfig, app);
        appConfigurations.set(app.name, appConfig);
        return appConfig;
      },
      async getAppConfig(app) {
        const appConfig = await (await fluxoraConfigMethods.getAppConfigBuilder(app)).build();
        self.setAppConfig(app.name, appConfig);
        return appConfig;
      },
      async withApps(fn) {
        for (const app of conf.apps) {
          await fn(await fluxoraConfigMethods.getAppConfig(app));
        }
      }
    };

    return merge(conf, fluxoraConfigMethods);
  }

  private validateConfig() {
    if (!this.fluxoraConfig.apps?.length) {
      logger.error("No apps found in the apps directory");
      return false;
    }

    return true;
  }
}
