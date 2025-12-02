import type {
  BackendRoute,
  Integration,
  Package,
  Route,
  ServerSetupContext,
  Velnora,
  AppContext as VelnoraAppContext,
  VelnoraContext
} from "@velnora/schemas";

import { Fs } from "./fs";
import { Pkg } from "./pkg";

export class AppContext implements VelnoraAppContext {
  private readonly appContexts = new Map<Package, Map<Integration, VelnoraContext>>();
  private readonly routeContexts = new Map<Route, ServerSetupContext>();

  constructor(private readonly velnora: Velnora) {}

  getOrCreateBackendHttpRouteContext(entry: BackendRoute) {
    if (this.routeContexts.has(entry)) {
      return this.routeContexts.get(entry)!;
    }

    const context: ServerSetupContext = {
      app: entry.app,
      basePath: entry.path,
      runtime: entry.runtime,
      logger: this.velnora.logger.extend({
        app: entry.app,
        logger: "velnora:server-setup",
        scope: `route:${entry.path}`
      })
    };
    this.routeContexts.set(entry, context);
    return context;
  }

  getOrCreateVelnoraContext(entry: Package, integration: Integration) {
    if (this.appContexts.has(entry)) {
      const map = this.appContexts.get(entry)!;
      if (map.has(integration)) return map.get(integration)!;
    }

    const context: VelnoraContext = {
      app: entry,
      root: entry.root,
      graph: this.velnora.graph,
      pkg: new Pkg(entry.packageJson),
      vite: this.velnora.vite.withApp(entry),
      fs: new Fs(entry),
      router: this.velnora.router.withApp(entry),
      logger: this.velnora.logger.extend({
        app: entry,
        logger: "velnora:integration",
        scope: `integration:${integration.name}`
      })
    };
    this.setContext(entry, integration, context);
    return context;
  }

  setContext(entry: Package, integration: Integration, context: VelnoraContext) {
    if (!this.appContexts.has(entry)) this.appContexts.set(entry, new Map());
    const map = this.appContexts.get(entry)!;
    map.set(integration, context);
  }
}
