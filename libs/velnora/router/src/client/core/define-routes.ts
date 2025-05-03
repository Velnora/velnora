import omit from "lodash.omit";

import type { Route, RoutesObject } from "@velnora/types";

export const defineRoutes = (routes: RoutesObject[]): Route[] => {
  const resolvedRoutes: Route[] = [];
  let routeStack: RoutesObject[] = routes;

  while (routeStack.length) {
    const currentRoute = routeStack.pop()!;
    resolvedRoutes.push(omit(currentRoute, ["children"]));
    if (currentRoute.children) {
      routeStack.push(...currentRoute.children.map(r => ({ ...r, path: `${currentRoute.path}/${r.path}` })));
    }
  }

  return resolvedRoutes;
};
