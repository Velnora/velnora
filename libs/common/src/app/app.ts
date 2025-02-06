import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { RollupOutput, RollupWatcher } from "rollup";
import type { InlineConfig } from "vite";

import type { UserAppConfig } from "@fluxora/types";
import type { MicroApp } from "@fluxora/types/core";
import { resolveConfigFile } from "@fluxora/utils/node";
import { build, getConfiguration } from "@fluxora/vite";

declare global {
  var __RESOLVED_USER_APP_CONFIGS__: Record<string, UserAppConfig>;
}

globalThis.__RESOLVED_USER_APP_CONFIGS__ ||= {};

export class App {
  constructor(protected readonly app: MicroApp) {}

  async resolveUserConfig() {
    if (globalThis.__RESOLVED_USER_APP_CONFIGS__[this.app.name])
      return globalThis.__RESOLVED_USER_APP_CONFIGS__[this.app.name];

    const configFileName = ["fluxora-app.config.js", "fluxora-app.config.ts"].find(configFileName =>
      existsSync(resolve(process.cwd(), "apps", this.app.name, configFileName))
    );

    if (!configFileName) return (globalThis.__RESOLVED_USER_APP_CONFIGS__[this.app.name] = {});
    const configFilePath = resolve(process.cwd(), "apps", this.app.name, configFileName);
    return (globalThis.__RESOLVED_USER_APP_CONFIGS__[this.app.name] = (await resolveConfigFile(configFilePath)) || {});
  }

  viteConfig(config: InlineConfig = {}) {
    return getConfiguration(config);
  }

  async build(): Promise<RollupOutput | RollupOutput[] | RollupWatcher | void> {
    return build(await this.viteConfig());
  }
}
