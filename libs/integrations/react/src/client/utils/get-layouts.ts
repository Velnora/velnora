import type { ComponentType, PropsWithChildren } from "react";

import type { WithDefault } from "@velnora/schemas";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";

export const getLayouts = async (route: ReactRouteDescriptor) => {
  const layoutPromises = route.layouts.map(
    layoutModuleId => import(layoutModuleId) as Promise<WithDefault<ComponentType<PropsWithChildren>>>
  );

  const layoutResults = await Promise.all(layoutPromises);
  return layoutResults.map(l => l.default).filter(a => !!a);
};
