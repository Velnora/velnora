import { isNil, merge } from "lodash";
import type { LiteralUnion } from "type-fest";
import type { EnvironmentOptions, Plugin } from "vite";

import type { Package, ViteApi } from "@velnora/schemas";

import { debug } from "../../utils/debug";
import type { ViteContainer } from "./vite-container";

export class Vite implements ViteApi {
  private readonly debug = debug.extend("vite-api");

  constructor(
    private readonly pkg: Package,
    private readonly vite: ViteContainer
  ) {}

  async use<TModule>(
    factory: Promise<TModule> | (() => Promise<TModule>),
    ...options: TModule extends (...args: infer TArgs) => unknown
      ? TArgs
      : TModule extends { default: (...args: infer TArgs) => unknown }
        ? TArgs
        : never
  ) {
    this.ensureNotUsed();

    this.debug("registering Vite plugin from factory");

    const pluginModule = await (typeof factory === "function" ? factory() : factory);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
    const plugin = (pluginModule as any).default ?? pluginModule;
    if (typeof plugin === "function") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result = plugin(...options) as Plugin;
      if (result && typeof result === "object") {
        this.vite.updateConfig({ plugins: [result] });

        this.debug("added Vite plugin to user config: %O", {
          pluginsCount: this.vite.userConfig.plugins?.length
        });
      }
    }
  }

  define(importPath: string, actualPath: string) {
    this.ensureNotUsed();

    this.debug("defining Vite alias: %O", { importPath, actualPath });
    this.vite.updateConfig({ resolve: { alias: { [importPath]: actualPath } } });
  }

  virtual(id: string, code?: string) {
    if (this.vite.virtualModulesMap.has(this.pkg)) {
      return this.vite.virtualModulesMap.get(this.pkg)!;
    }

    this.debug("registering Vite virtual module: %O", { id });
    const virtualName = `virtual://${this.pkg.id}/${id}`;
    if (isNil(code)) {
      throw new Error(`For first time registering virtual module, code must be provided: ${this.pkg.name}@${id}`);
    }
    this.vite.virtualModules.set(virtualName, code);
    this.vite.virtualModulesMap.set(this.pkg, virtualName);
    return virtualName;
  }

  addEnvironment(side: LiteralUnion<"client" | "server", string>, environment: EnvironmentOptions) {
    this.ensureNotUsed();

    this.debug("adding Vite environment for package: %O", { packageName: this.pkg.name, side });

    const envName = `${this.pkg.name.replace(/[^a-zA-Z0-9]/g, "_")}_${side}`;
    this.vite.updateConfig({
      environments: {
        [envName]: merge<EnvironmentOptions, EnvironmentOptions>(environment, {
          define: { __VELNORA_APP__: JSON.stringify(this.pkg) }
        })
      }
    });

    this.debug("environment for package %s: %O", this.pkg.name, this.vite.userConfig.environments?.[envName]);
    this.virtual("app-config", `export const appConfig = JSON.parse(__VELNORA_APP__);`);
  }

  private ensureNotUsed() {
    if (this.vite.isUsed) {
      this.debug("attempted to modify Vite config after build");
      throw new Error("Vite API already built configuration. Further modifications are not allowed.");
    }
  }
}
