import type { RegisteredApp, Route, WithDefault } from "@velnora/types";
import { VIRTUAL_ENTRIES } from "@velnora/utils";

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
        routeResolver.append(route.path, { ...route, app });
      }
    } else {
      throw "";
    }
  } catch (err) {
    routeResolver.append("/", {
      app,
      component: () => import(/* @vite-ignore */ VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(app.name))
    });
  }

  return routeResolver;
};
