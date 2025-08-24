import { existsSync } from "node:fs";

import { RouteResolver } from "@velnora/router";
import { Entity } from "@velnora/runtime";
import type { Route, WithDefault } from "@velnora/types";
import { VIRTUAL_ENTRIES } from "@velnora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@velnora/utils/node";

export const resolveRoutes = async (entity: Entity) => {
  const routeResolver = new RouteResolver();

  const routePath = findFile(entity.app.root, "client/routes", CLIENT_ENTRY_FILE_EXTENSIONS);

  if (routePath && existsSync(routePath)) {
    const routes = await entity.viteRunner.runner.import<WithDefault<Route[]> & { routes: Route[] }>(routePath);
    const definedRoutes = routes?.routes || routes.default;
    if (!definedRoutes) {
      throw new Error(`No routes found for ${entity.app.name}`);
    }

    definedRoutes.forEach(route => {
      routeResolver.append(route.path, { app: entity.app, ...route });
    });
  } else {
    const fileModule = findFile(entity.app.root, "client/entry-client", CLIENT_ENTRY_FILE_EXTENSIONS);
    if (fileModule) {
      routeResolver.append("/", {
        component: () => entity.viteRunner.runner.import(fileModule),
        app: entity.app
      });
    }
  }

  routeResolver.append(VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(entity.app.name), {
    app: entity.app,
    component: () => entity.viteRunner.transformRequest(VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(entity.app.name))
  });

  return routeResolver;
};
