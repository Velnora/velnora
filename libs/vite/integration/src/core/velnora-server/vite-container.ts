import { merge } from "lodash";
import { type UserConfig, mergeConfig } from "vite";

import type { Package } from "@velnora/schemas";

import { devSourceMapPlugin } from "../../plugins/dev-source-map.plugin";
import { virtualModulePlugin } from "../../plugins/virtual-module.plugin";
import { debug } from "../../utils/debug";
import { Vite } from "./vite";

export class ViteContainer {
  private readonly debug = debug.extend("vite-container");
  isUsed = false;

  private readonly _virtualModules = new Map<string, string>();
  private readonly _virtualModulesMap = new Map<Package, string>();
  private _userConfig: UserConfig = {
    root: process.cwd(),
    plugins: [devSourceMapPlugin()],
    server: { middlewareMode: true },
    logLevel: "error",
    appType: "custom"
  };

  constructor(initialConfig: UserConfig = {}) {
    this.debug("initializing Vite API user config: %O", {
      hasInitialConfig: Object.keys(initialConfig).length > 0
    });

    this._userConfig = merge(this._userConfig, initialConfig);

    this.debug("merged initial user config into base config");
  }

  get virtualModules() {
    return this._virtualModules;
  }

  get virtualModulesMap() {
    return this._virtualModulesMap;
  }

  get userConfig() {
    return this._userConfig;
  }

  updateConfig(update: Partial<UserConfig> | ((current: UserConfig) => Partial<UserConfig>)) {
    if (typeof update === "function") {
      const result = update(this._userConfig);
      this._userConfig = mergeConfig(this._userConfig, result);
      this.debug("updated Vite user config via function: %O", { updatedKeys: Object.keys(result) });
    } else {
      this._userConfig = mergeConfig(this._userConfig, update);
      this.debug("updated Vite user config via object: %O", { updatedKeys: Object.keys(update) });
    }
    this.debug("updated vite user config: %O", this._userConfig);
  }

  withApp(pkg: Package) {
    return new Vite(pkg, this);
  }

  build() {
    if (this.isUsed) {
      this.debug("Vite configuration already built, returning existing config");
      throw new Error("Vite API already built configuration. Further modifications are not allowed.");
    }

    this.debug("building final Vite configuration: %O", {
      existingPlugins: this.userConfig.plugins?.length ?? 0,
      virtualModules: this.virtualModules.size
    });

    this.userConfig.plugins ||= [];
    this.userConfig.plugins.push(virtualModulePlugin(this.virtualModules));

    this.isUsed = true;
    this.debug("Vite configuration marked as used");

    return this.userConfig;
  }
}
