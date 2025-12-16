import type { FC } from "react";

import type { WithDefault } from "@velnora/types";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";

export const getMetadata = async (route: ReactRouteDescriptor) => {
  const modules = [route.module, ...route.layouts];
  const resolvedModules = await Promise.all(modules.map(moduleId => import(moduleId) as Promise<WithDefault<FC>>));
  const [Page, ...layouts] = resolvedModules;
  if (!Page) throw new Error(`No default export found in page module: ${route.module}`);
  return { Page: Page.default, layouts: layouts.map(l => l.default) };
};
