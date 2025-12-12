import { type FC, useMemo } from "react";
import type { ClientRoute, Router as VelnoraRouter } from "velnora/router";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { routerContext } from "../router/router-context";
import { RouterClient } from "./router.client";
import { RouterServer } from "./router.server";

export interface RouterProps {
  router: VelnoraRouter;
  routes: ClientRoute[];
}

export const Router: FC<RouterProps> = ({ router, routes }) => {
  const pathRouteMap = useMemo(
    () => new Map<string, ReactRouteDescriptor>(routes.map(r => [r.path, r.route])),
    [routes]
  );

  return (
    <routerContext.Provider value={{ router }}>
      {import.meta.env.CLIENT ? (
        <RouterClient router={router} routes={routes} pathRouteMap={pathRouteMap} />
      ) : (
        <RouterServer router={router} routes={routes} pathRouteMap={pathRouteMap} />
      )}
    </routerContext.Provider>
  );
};
