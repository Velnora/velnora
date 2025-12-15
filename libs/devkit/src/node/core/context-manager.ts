import type { BackendRoute, Logger, ServerSetupContext } from "@velnora/types";

export class ContextManager {
  private readonly contexts = new Map<BackendRoute, ServerSetupContext>();

  constructor(private readonly logger: Logger) {}

  getFor(route: BackendRoute) {
    if (this.contexts.has(route)) {
      return this.contexts.get(route)!;
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
    this.contexts.set(route, context);
    return context;
  }
}
