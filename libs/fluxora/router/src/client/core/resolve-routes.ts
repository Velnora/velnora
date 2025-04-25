import type { RegisteredApp, Route, WithDefault } from "@fluxora/types";
import { VIRTUAL_ENTRIES } from "@fluxora/utils";

import { RouteResolver } from "./route-resolver";

export const resolveRoutes = async (app: RegisteredApp): Promise<RouteResolver> => {
  const routeResolver = new RouteResolver();

  try {
    const routesModule = (await import(/* @vite-ignore */ VIRTUAL_ENTRIES.APP_CLIENT_ROUTES(app.name))) as WithDefault<
      Route[],
      Record<"routes", Route[]>
    >;
    const definedRoutes = routesModule?.routes || routesModule.default;
    if (definedRoutes) {
      for (const route of definedRoutes) {
        routeResolver.append(route.path, route);
      }
    } else {
      throw "";
    }
  } catch (err) {
    routeResolver.append("/", {
      component: () => import(/* @vite-ignore */ VIRTUAL_ENTRIES.APP_CLIENT_ENTRY(app.name))
    });
  }

  return routeResolver;
};
