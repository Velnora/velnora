import { isNil, merge } from "lodash";
import type { LiteralUnion } from "type-fest";
import type { EnvironmentOptions } from "vite";

import type { Package, VelnoraConfig, VirtualOptions, ViteApi } from "@velnora/schemas";

import { debug } from "../../utils/debug";
import type { ViteContainer } from "./vite-container";

export class Vite implements ViteApi {
  private readonly debug = debug.extend("vite-api");

  constructor(
    private readonly pkg: Package,
    private readonly vite: ViteContainer,
    private readonly config: VelnoraConfig
  ) {}

  get virtualPrefix() {
    return `${this.config.cacheDir}/virtual/${this.pkg.id}`;
  }

  get virtualAppConfig() {
    return `${this.virtualPrefix}/app-config.ts`;
  }

  define(importPath: string, actualPath: string) {
    this.ensureNotUsed();

    this.debug("defining Vite alias: %O", { importPath, actualPath });
    this.vite.updateConfig({ resolve: { alias: { [importPath]: actualPath } } });
  }

  virtual(id: string, code?: string, options?: VirtualOptions) {
    const identifier = `${this.pkg.id}_${id}`;

    if ((this.vite.virtualModules.has(identifier) || this.vite.idVirtualNameMapping.has(identifier)) && isNil(code)) {
      return this.vite.idVirtualNameMapping.has(identifier)
        ? this.vite.idVirtualNameMapping.get(identifier)!
        : this.vite.virtualModules.get(identifier)!;
    }

    const extension = options?.extension || "ts";
    this.debug("registering Vite virtual module: %O", { id });
    const virtualName = `${this.virtualPrefix}/${id}.${extension}`;
    if (isNil(code)) {
      throw new Error(`For first time registering virtual module, code must be provided: ${this.pkg.name}@${id}`);
    }

    this.vite.idVirtualNameMapping.set(identifier, virtualName);
    this.vite.virtualModules.set(virtualName, code);
    return virtualName;
  }

  entryClient(code?: string, options?: VirtualOptions) {
    this.ensureNotUsed();

    this.debug("registering Vite client entry module for package: %O", { packageName: this.pkg.name });
    return this.virtual("entry/client", code, options);
  }

  entrySsr(code?: string, options?: VirtualOptions) {
    this.ensureNotUsed();

    this.debug("registering Vite SSR entry module for package: %O", { packageName: this.pkg.name });
    return this.virtual("entry/ssr", code, options);
  }

  entryServer(code?: string, options?: VirtualOptions) {
    this.ensureNotUsed();

    this.debug("registering Vite server entry module for package: %O", { packageName: this.pkg.name });
    return this.virtual("entry/server", code, options);
  }

  addEnvironment(side: LiteralUnion<"client" | "server" | "ssr", string>, environment: EnvironmentOptions = {}) {
    this.ensureNotUsed();

    this.debug("adding Vite environment for package: %O", { packageName: this.pkg.name, side });

    const envName = `${this.pkg.id.replace(/^[^a-zA-Z0-9]+/, "").replace(/[^a-zA-Z0-9]/g, "_")}_${side}`;
    this.vite.updateConfig({
      environments: {
        [envName]: merge<EnvironmentOptions, EnvironmentOptions>(environment, {
          consumer:
            environment.consumer ??
            (side === "server" || side === "ssr" ? "server" : side === "client" ? "client" : undefined)
        })
      }
    });

    this.debug("environment for package %s: %O", this.pkg.name, this.vite.userConfig.environments?.[envName]);
    this.virtual("app-config", `export const appConfig = ${JSON.stringify(this.pkg)};`);

    return envName;
  }

  private ensureNotUsed() {
    if (this.vite.isUsed) {
      this.debug("attempted to modify Vite config after build");
      throw new Error("Vite API already built configuration. Further modifications are not allowed.");
    }
  }
}
