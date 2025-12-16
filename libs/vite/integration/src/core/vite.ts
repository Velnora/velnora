import _ from "lodash";
import type { LiteralUnion } from "type-fest";
import type { EnvironmentOptions } from "vite";

import type { Package, VelnoraConfig, VirtualOptions, ViteApi } from "@velnora/types";

import { debug } from "../utils/debug";
import type { ViteContainer } from "./vite-container";

export class Vite implements ViteApi {
  private readonly debug = debug.extend("vite-api");

  constructor(
    private readonly pkg: Package,
    private readonly vite: ViteContainer,
    private readonly config: VelnoraConfig
  ) {}

  get virtualPrefix() {
    return `/${this.config.cacheDir}/virtual/${this.pkg.name}`;
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

    if ((this.vite.virtualModules.has(identifier) || this.vite.idVirtualNameMapping.has(identifier)) && _.isNil(code)) {
      return this.vite.idVirtualNameMapping.has(identifier)
        ? this.vite.idVirtualNameMapping.get(identifier)!
        : this.vite.virtualModules.get(identifier)!;
    }

    const extension = options?.extension || "ts";
    this.debug("registering Vite virtual module: %O", { id });
    const prefix = options?.global ? `/${this.config.cacheDir}` : this.virtualPrefix;
    const virtualName = `${prefix}/${id}.${extension}`;
    if (_.isNil(code)) {
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

    const envName = `${this.pkg.name.replace(/^[^a-zA-Z0-9]+/, "").replace(/[^a-zA-Z0-9]/g, "_")}_${side}`;
    this.vite.updateConfig({
      environments: {
        [envName]: _.merge<EnvironmentOptions, EnvironmentOptions>(environment, {
          define: {
            "import.meta.env.CLIENT": JSON.stringify(side === "client"),
            "import.meta.env.SERVER": JSON.stringify(side === "server" || side === "ssr")
          },
          consumer:
            environment.consumer ??
            (side === "server" || side === "ssr" ? "server" : side === "client" ? "client" : undefined)
        })
      }
    });

    this.debug("environment for package %s: %O", this.pkg.name, this.vite.userConfig.environments?.[envName]);
    this.virtual(
      "app-config",
      `
import { Node } from "@velnora/devkit";
    
const appConfigJSON = ${JSON.stringify(this.pkg)};
export const appConfig = Node.fromJSON(appConfigJSON);
`
    );

    return envName;
  }

  addClientEnvironment(environment?: EnvironmentOptions) {
    return this.addEnvironment("client", environment);
  }

  addServerEnvironment(environment?: EnvironmentOptions) {
    return this.addEnvironment("server", environment);
  }

  addSsrEnvironment(environment?: EnvironmentOptions) {
    return this.addEnvironment("ssr", environment);
  }

  private ensureNotUsed() {
    if (this.vite.isUsed) {
      this.debug("attempted to modify Vite config after build");
      throw new Error("Vite API already built configuration. Further modifications are not allowed.");
    }
  }
}
