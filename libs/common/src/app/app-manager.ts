import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { type AppName, AppType, type MicroApp, type UserConfig } from "@fluxora/types/core";
import { projectFs, resolveConfigFile } from "@fluxora/utils/node";

import { App } from "./app";
import type { TemplateApp } from "./template-app";

declare global {
  var __RESOLVED_USER_CONFIG__: UserConfig;
}

type Apps = { [key in `${AppType.TEMPLATE}::${string}`]: TemplateApp } & Record<string, App>;

class AppManager {
  private readonly appList = [] as AppName[];
  private readonly apps: Apps = {};
  private readonly fs = projectFs(process.cwd());

  async resolveUserConfig() {
    if (globalThis.__RESOLVED_USER_CONFIG__) return globalThis.__RESOLVED_USER_CONFIG__;

    const configFileName = ["fluxora.config.js", "fluxora.config.ts"].find(configFileName =>
      existsSync(resolve(process.cwd(), configFileName))
    );

    if (!configFileName) return (globalThis.__RESOLVED_USER_CONFIG__ = {});
    const configFilePath = resolve(process.cwd(), configFileName);
    return (globalThis.__RESOLVED_USER_CONFIG__ = (await resolveConfigFile(configFilePath)) || {});
  }

  async resolvePkgJson() {}

  registerTemplate(name: string) {
    const appName = `${AppType.TEMPLATE}::${name}` as const;
    this.appList.push(appName);
    this.apps[appName] = new TemplateApp({
      type: AppType.TEMPLATE,
      name: appName,
      root: resolve(process.cwd(), "template")
    });

    return this.apps[appName];
  }

  getApp(app: MicroApp) {
    const foundAppName = [AppType.TEMPLATE, AppType.APPLICATION, AppType.LIBRARY].find(
      type => !!this.apps[`${type}::${app.name}` as AppName]
    );
    if (!foundAppName) return null;
    return this.apps[foundAppName];
  }
}

export const appManager = new AppManager();
