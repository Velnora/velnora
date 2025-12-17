import _ from "lodash";
import { type UserConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import type { Package, Router, VelnoraConfig } from "@velnora/types";

import { devSourceMapPlugin } from "../plugins/dev-source-map.plugin";
import { htmlPlugin } from "../plugins/html";
import { virtualModulePlugin } from "../plugins/virtual-module.plugin";
import { debug } from "../utils/debug";
import { findTsconfigProject } from "../utils/find-tsconfig-project";
import { Vite } from "./vite";

const projects: string[] = [];
let project: string;
if ((project = findTsconfigProject())) {
  projects.push(project);
}

export class ViteContainer {
  private readonly debug = debug.extend("vite-container");
  private readonly _virtualModules = new Map<string, string>();
  private readonly _idVirtualNameMapping = new Map<string, string>();
  private _isUsed = false;

  private _userConfig: UserConfig = {
    root: process.cwd(),
    clearScreen: false,
    build: { sourcemap: true },
    server: { middlewareMode: true },
    define: {
      "import.meta.env.CLIENT": "typeof window !== 'undefined'",
      "import.meta.env.SERVER": "typeof window === 'undefined'"
    },
    plugins: [
      tsconfigPaths({
        // ToDo: replace with [allowImportersRe](https://github.com/aleclarson/vite-tsconfig-paths/pull/193) when merged
        projects,
        loose: true
      })
    ],
    logLevel: "error",
    // ToDo: Make custom logger instance mapped to velnora logger instance
    appType: "custom"
  };

  static create(config: VelnoraConfig, router: Router, initialConfig: UserConfig = {}) {
    return new ViteContainer(config, router, initialConfig);
  }

  private constructor(
    private readonly config: VelnoraConfig,
    router: Router,
    initialConfig: UserConfig = {}
  ) {
    this.debug("initializing Vite API user config: %O", {
      hasInitialConfig: Object.keys(initialConfig).length > 0
    });

    this.updateConfig(initialConfig);
    this.config.integrations.forEach(integration => integration.vite && this.updateConfig(integration.vite));
    this.updateConfig({
      plugins: [devSourceMapPlugin(config), htmlPlugin(router), virtualModulePlugin(this.config, this.virtualModules)]
    });

    this.debug("merged initial user config into base config");
  }

  get idVirtualNameMapping() {
    return this._idVirtualNameMapping;
  }

  get isUsed() {
    return this._isUsed;
  }

  get virtualModules() {
    return this._virtualModules;
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
    const vite = new Vite(pkg, this, this.config);
    const config = _.omit(this.config, "integrations");
    vite.virtual("config", `export default ${JSON.stringify(config, null, 2)};`, { global: true });
    return vite;
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

    this._isUsed = true;
    this.debug("Vite configuration marked as used");

    return this.userConfig;
  }
}
