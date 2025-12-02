import { isNil, merge } from "lodash";
import type { LiteralUnion } from "type-fest";
import type { EnvironmentOptions, PluginOption } from "vite";

import type { Package, VelnoraConfig, ViteApi } from "@velnora/schemas";

import { debug } from "../../utils/debug";
import type { ViteContainer } from "./vite-container";

export class Vite implements ViteApi {
  private readonly debug = debug.extend("vite-api");

  constructor(
    private readonly pkg: Package,
    private readonly vite: ViteContainer,
    private readonly config: VelnoraConfig
  ) {}

  use(...plugins: PluginOption[]) {
    this.ensureNotUsed();

    this.debug("registering Vite plugin from factory");

    this.vite.updateConfig({ plugins });
    this.debug("added Vite plugin to user config: %O", {
      pluginsCount: this.vite.userConfig.plugins?.length
    });
  }

  define(importPath: string, actualPath: string) {
    this.ensureNotUsed();

    this.debug("defining Vite alias: %O", { importPath, actualPath });
    this.vite.updateConfig({ resolve: { alias: { [importPath]: actualPath } } });
  }

  virtual(id: string, code?: string) {
    if (this.vite.virtualModules.has(id)) {
      return this.vite.virtualModules.get(id)!;
    }

    this.debug("registering Vite virtual module: %O", { id });
    const virtualName = `${this.config.cacheDir}/virtual/${this.pkg.id}/${id}.ts`;
    if (isNil(code)) {
      throw new Error(`For first time registering virtual module, code must be provided: ${this.pkg.name}@${id}`);
    }

    this.vite.virtualModules.set(virtualName, code);
    return virtualName;
  }

  entryClient(code?: string) {
    this.ensureNotUsed();

    this.debug("registering Vite client entry module for package: %O", { packageName: this.pkg.name });
    return this.virtual("entry/client", code);
  }

  entryServer(code?: string) {
    this.ensureNotUsed();

    this.debug("registering Vite server entry module for package: %O", { packageName: this.pkg.name });
    return this.virtual("entry/server", code);
  }

  addEnvironment(side: LiteralUnion<"client" | "server", string>, environment: EnvironmentOptions) {
    this.ensureNotUsed();

    this.debug("adding Vite environment for package: %O", { packageName: this.pkg.name, side });

    const envName = `${this.pkg.id.replace(/^[^a-zA-Z0-9]+/, "").replace(/[^a-zA-Z0-9]/g, "_")}_${side}`;
    this.vite.updateConfig({
      environments: {
        [envName]: merge<EnvironmentOptions, EnvironmentOptions>(environment, {
          define: { __VELNORA_APP__: JSON.stringify(this.pkg) }
        })
      }
    });

    this.debug("environment for package %s: %O", this.pkg.name, this.vite.userConfig.environments?.[envName]);
    this.virtual("app-config", `export const appConfig = JSON.parse(__VELNORA_APP__);`);

    return envName;
  }

  private ensureNotUsed() {
    if (this.vite.isUsed) {
      this.debug("attempted to modify Vite config after build");
      throw new Error("Vite API already built configuration. Further modifications are not allowed.");
    }
  }
}
