import type { FC } from "react";
import { createRoot } from "react-dom/client";

import type { TypedRoute, WithDefault } from "@fluxora/types";
import { FLUXORA_APP_CONTAINER } from "@fluxora/utils";

export const mount = async (route: TypedRoute) => {
  const mod = await route.component<WithDefault<FC>>();
  const Component = mod.default;

  createRoot(document.getElementById(FLUXORA_APP_CONTAINER)!).render(<Component />);
};
