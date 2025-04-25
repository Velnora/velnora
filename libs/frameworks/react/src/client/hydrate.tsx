import type { FC, PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";

import type { TypedRoute, WithDefault } from "@fluxora/types";
import { capitalize } from "@fluxora/utils";

export const hydrate = async (route: TypedRoute, Template: FC<PropsWithChildren>) => {
  const mod = await route.component<WithDefault<FC, Record<string, FC>>>();
  const Component = mod[capitalize(route.app.name)] || mod.default;

  hydrateRoot(
    document,
    <Template>
      <Component />
    </Template>
  );
};
