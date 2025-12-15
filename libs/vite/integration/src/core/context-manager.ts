import type { Integration, Logger, Package, Router, VelnoraContext } from "@velnora/types";

import { Fs } from "./fs";
import { Pkg } from "./pkg";
import type { ViteContainer } from "./vite-container";

export class ContextManager {
  private readonly contexts = new Map<Package, Map<Integration, VelnoraContext>>();

  constructor(
    private readonly viteContainer: ViteContainer,
    private readonly router: Router,
    private readonly logger: Logger
  ) {}

  getFor(entry: Package, integration: Integration) {
    if (this.contexts.has(entry)) {
      const map = this.contexts.get(entry)!;
      if (map.has(integration)) return map.get(integration)!;
    }

    const context: VelnoraContext = {
      root: entry.root,
      app: entry,
      pkg: new Pkg(entry.packageJson),
      router: this.router.withApp(entry),
      fs: new Fs(entry),
      vite: this.viteContainer.withApp(entry),
      logger: this.logger.extend({
        app: entry,
        logger: "velnora:integration",
        scope: `integration:${integration.name}`
      })
    };
    this.setContext(entry, integration, context);
    return context;
  }

  setContext(entry: Package, integration: Integration, context: VelnoraContext) {
    if (!this.contexts.has(entry)) this.contexts.set(entry, new Map());
    const map = this.contexts.get(entry)!;
    map.set(integration, context);
  }
}
