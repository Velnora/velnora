import type { AppModuleGraph, Package, VelnoraContext } from "@velnora/schemas";

import type { ViteContainer } from "../velnora-server/vite-container";
import { Fs } from "./fs";
import { Pkg } from "./pkg";

export class AppContext {
  private readonly appContexts = new WeakMap<Package, VelnoraContext>();

  constructor(
    private readonly graph: AppModuleGraph,
    private readonly vite: ViteContainer
  ) {}

  getContext(entry: Package) {
    return this.appContexts.get(entry);
  }

  getOrCreateContext(entry: Package): VelnoraContext {
    if (this.appContexts.has(entry)) {
      return this.appContexts.get(entry)!;
    }

    const context: VelnoraContext = {
      app: entry,
      root: entry.root,
      graph: this.graph,
      // router: this.router
      pkg: new Pkg(entry.packageJson),
      vite: this.vite.withApp(entry),
      fs: new Fs(entry)
      // ast: AstApi;
      // registry: RegistryApi;
      // log: Logger;
    };
    this.setContext(entry, context);
    return context;
  }

  setContext(entry: Package, context: VelnoraContext) {
    this.appContexts.set(entry, context);
  }
}
