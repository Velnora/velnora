import type { InternalRoute, RouteWithExact } from "@fluxora/types";
import { BaseClass, ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

@ClassExtensions()
export class RouteResolver extends BaseClass {
  @ClassGetterSetter()
  declare routes: Map<string, InternalRoute>;

  append(path: string, route: Omit<InternalRoute, "path">) {
    if (this.routes.has(path)) {
      throw new Error(`Route already exists for path: ${path}`);
    }
    this.routes.set(path, { path, ...route });
  }

  getSilent(path: string) {
    return this.routes.get(path);
  }

  get(path: string) {
    const route = this.getSilent(path);
    if (!route) {
      throw new Error(`Route not found for path: ${path}`);
    }
    return route;
  }

  getWithFallback(path: string, fallback: string) {
    const route = this.getSilent(path);
    if (route) {
      return route;
    }

    const fallbackRoute = this.getSilent(fallback);
    if (!fallbackRoute) {
      throw new Error(`Route not found for path: ${path} and fallback: ${fallback}`);
    }
    return fallbackRoute;
  }

  getStartsWith(path: string) {
    const routes: RouteWithExact[] = [];
    for (const [routePath, element] of this) {
      if (routePath.startsWith(path)) {
        routes.push({ ...element, exact: routePath === path });
      }
    }

    if (routes.length > 0) {
      return routes;
    }

    throw new Error(`Route not found starts with: ${path}`);
  }

  *[Symbol.iterator]() {
    yield* this.routes.entries();
  }
}
