import type { FC, PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";

import type { InternalRoute, WithDefault } from "@fluxora/types";

export const hydrate = async (route: InternalRoute, Template: FC<PropsWithChildren>) => {
  const mod = await route.component<WithDefault<FC>>();
  const Component = mod.default;

  hydrateRoot(
    document,
    <Template>
      <Component />
    </Template>
  );
};
