import type { ComponentType } from "react";

import type { WithDefault } from "@velnora/schemas";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";

export const getPage = async (route: ReactRouteDescriptor) => {
  const { default: Page } = (await import(route.module)) as WithDefault<ComponentType>;

  if (!Page) {
    // ToDo: Implement registering a 404 page route
    // console.error(`No matching page found for path: ${router.path}`);
    return;
  }

  return Page;
};
