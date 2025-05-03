import type { FC } from "react";
import { createRoot } from "react-dom/client";

import type { TypedRoute, WithDefault } from "@velnora/types";
import { APP_CONTAINER, capitalize } from "@velnora/utils";

export const mount = async (route: TypedRoute) => {
  const mod = await route.component<WithDefault<FC, Record<string, FC>>>();
  const Component = mod[capitalize(route.app.name)] || mod.default;

  createRoot(document.getElementById(APP_CONTAINER)!).render(<Component />);
};
