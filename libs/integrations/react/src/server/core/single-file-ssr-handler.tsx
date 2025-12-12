import type { JSX } from "react";
import { renderToString } from "react-dom/server";
import type { ClientRoute } from "velnora/router";

import type { RenderFn } from "@velnora/router";
import type { WithDefault } from "@velnora/schemas";

import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";

export const singleFileSsrHandler = (route: ClientRoute<ReactRouteDescriptor>): RenderFn => {
  return async ctx => {
    const { default: app } = await ctx.serverEnv.runner.import<WithDefault<JSX.Element>>(route.route.module);
    if (!app) {
      ctx.logger.error(`No default export found in entry file: ${route.route.module}`);
      return { status: 500, body: "Internal Server Error" };
    }
    const html = renderToString(app);

    return { body: html, status: 200, headers: { "Content-Type": "text/html" } };
  };
};
