import type { Logger, Package, Route, Router as VelnoraRouter } from "@velnora/types";

import { debug } from "../utils/debug";
import { Routing } from "./routing";

export class Router implements VelnoraRouter {
  private readonly cache = new Map<string, Route>();

  private readonly debug = debug.extend("router");

  private readonly routes: Route[] = [];

  private constructor(private readonly logger: Logger) {}

  static create(logger: Logger) {
    return new Router(logger);
  }

  register(route: Route) {
    this.routes.push(route);
    this.cache.set(route.id, route);
    this.debug("registered route: %O", { route });
    this.logger.log(`Registered route for app: ${route.app.name}`);
    return this;
  }

  parse(url: string) {
    const parsedUrl = new URL(url, "http://localhost");
    return { path: parsedUrl.pathname, query: parsedUrl.searchParams };
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  withApp(app: Package) {
    return new Routing(this, app);
  }

  getRoutes() {
    return this.routes.toSorted(
      (a, b) =>
        b.path.split("/").filter(Boolean).length - a.path.split("/").filter(Boolean).length ||
        b.path.length - a.path.length
    );
  }
}
