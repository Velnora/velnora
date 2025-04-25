import type { FC } from "react";
import { type Root, createRoot } from "react-dom/client";

import type { InternalRoute, WithDefault } from "@fluxora/types";
import { FLUXORA_APP_CONTAINER } from "@fluxora/utils";

let root: Root | null = null;
let internalRoute: InternalRoute | null = null;

export const mount = async (route: InternalRoute) => {
  if (!route || route !== internalRoute) internalRoute = route;
  if (!root) root = createRoot(document.getElementById(FLUXORA_APP_CONTAINER)!);

  const mod = await route.component<WithDefault<FC>>();
  const Component = mod.default;

  root.render(<Component />);
};

export const unmount = () => {
  root?.unmount();
  root = null;
};

import.meta.hot?.accept(async mod => {
  if (mod?.mount) {
    unmount();
    await mod.mount(internalRoute);
  }
});
