import type {
  BackendRoute,
  Integration,
  Logger,
  Package,
  Router,
  ServerSetupContext,
  TypeGenerator,
  VelnoraContext,
  ContextManager as VelnoraContextManager
} from "@velnora/types";
import type { ViteContainer } from "@velnora/vite-integration";

import { Fs } from "../helper/fs";
import { Pkg } from "../helper/pkg";

export class ContextManager implements VelnoraContextManager {
  private readonly integrationContexts = new Map<Package, Map<Integration, VelnoraContext>>();

  private readonly serverContexts = new Map<BackendRoute, ServerSetupContext>();

  constructor(
    private readonly viteContainer: ViteContainer,
    private readonly router: Router,
    private readonly typeGenerator: TypeGenerator,
    private readonly logger: Logger
  ) {}

  forIntegration(entry: Package, integration: Integration) {
    if (this.integrationContexts.has(entry)) {
      const map = this.integrationContexts.get(entry)!;
      if (map.has(integration)) return map.get(integration)!;
    }

    const context: VelnoraContext = {
      root: entry.root,
      app: entry,
      pkg: new Pkg(entry.packageJson),
      router: this.router.withApp(entry),
      fs: new Fs(entry.root),
      vite: this.viteContainer.withApp(entry),
      types: this.typeGenerator.withApp(entry),
      logger: this.logger.extend({
        app: entry,
        logger: "velnora:integration",
        scope: `integration:${integration.name}`
      })
    };

    if (!this.integrationContexts.has(entry)) this.integrationContexts.set(entry, new Map());
    const map = this.integrationContexts.get(entry)!;
    map.set(integration, context);

    return context;
  }

  forRoute(route: BackendRoute) {
    if (this.serverContexts.has(route)) {
      return this.serverContexts.get(route)!;
    }

    const context: ServerSetupContext = {
      app: route.app,
      basePath: route.path,
      runtime: route.runtime,
      logger: this.logger.extend({
        app: route.app,
        logger: "velnora:server-setup",
        scope: `route:${route.path}`
      })
    };
    this.serverContexts.set(route, context);
    return context;
  }
}
