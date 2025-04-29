import { existsSync } from "node:fs";

import { type RegisteredApp, appCtx } from "@fluxora/runtime";
import type { Route, WithDefault } from "@fluxora/types";
import { VIRTUAL_ENTRIES } from "@fluxora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@fluxora/utils/node";

import { RouteResolver } from "../../client/core/route-resolver";

export const resolveRoutes = async (app: RegisteredApp) => {
  const routeResolver = new RouteResolver();

  const vite = appCtx.vite.getSsr(app.name);
  const routePath = findFile(app.root, "client/routes", CLIENT_ENTRY_FILE_EXTENSIONS);

  if (routePath && existsSync(routePath)) {
    const routes = await vite.runner.import<WithDefault<Route[]> & { routes: Route[] }>(routePath);
    const definedRoutes = routes?.routes || routes.default;
    if (!definedRoutes) {
      throw new Error(`No routes found for ${app.name}`);
    }

    definedRoutes.forEach(route => {
      routeResolver.append(route.path, { app, ...route });
    });
  } else {
    const fileModule = findFile(app.root, "client/entry-client", CLIENT_ENTRY_FILE_EXTENSIONS);
    if (fileModule) {
      routeResolver.append("/", {
        component: () => vite.runner.import(fileModule),
        app
      });
    }
  }

  routeResolver.append(VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(app.name), {
    app,
    component: () => vite.transformRequest(VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(app.name))
  });

  return routeResolver;
};
