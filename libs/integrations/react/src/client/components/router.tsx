import { type FC, useMemo } from "react";
import type { ClientRoute, Router as VelnoraRouter } from "velnora/router";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { routerContext } from "../router/router-context";

export interface RouterProps {
  router: VelnoraRouter;
  routes: ClientRoute[];
}

const RouterSide = (await (import.meta.env.CLIENT ? import("./router.client") : import("./router.server"))) as Record<
  string,
  FC<RouterProps & { pathRouteMap: Map<string, ReactRouteDescriptor> }>
>;
const RouterImpl = (import.meta.env.CLIENT ? RouterSide.RouterClient : RouterSide.RouterServer)!;

export const Router: FC<RouterProps> = ({ router, routes }) => {
  const pathRouteMap = useMemo(
    () => new Map<string, ReactRouteDescriptor>(routes.map(r => [r.path, r.route])),
    [routes]
  );

  return (
    <routerContext.Provider value={{ router }}>
      <RouterImpl router={router} routes={routes} pathRouteMap={pathRouteMap} />
    </routerContext.Provider>
  );
};
