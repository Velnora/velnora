import type { FC, PropsWithChildren } from "react";

import type { Router as VelnoraRouter } from "@velnora/router/client";

import { routerContext } from "../router/router-context";

export interface RouterProps {
  router: VelnoraRouter;
}

export const Router: FC<PropsWithChildren<RouterProps>> = ({ router, children }) => {
  return <routerContext.Provider value={{ router }}>{children}</routerContext.Provider>;
};
