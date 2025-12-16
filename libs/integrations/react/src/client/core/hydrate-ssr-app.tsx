import type { JSX } from "react";
import type { ClientRoute } from "velnora/router";
import type { Router as VelnoraRouter } from "velnora/router";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { Router } from "../components/router";
import { RouterClient } from "../components/router.client";
import { mount } from "./mount";

export const hydrateSsrApp = (initialElement: JSX.Element, router: VelnoraRouter, routes: ClientRoute[]) => {
  const pathRouteMap = new Map<string, ReactRouteDescriptor>(routes.map(r => [r.path, r.route]));
  mount(
    <Router router={router}>
      <RouterClient pathRouteMap={pathRouteMap}>{initialElement}</RouterClient>
    </Router>,
    { mode: "ssr" }
  );
};
