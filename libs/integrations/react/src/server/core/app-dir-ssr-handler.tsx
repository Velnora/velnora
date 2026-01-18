import * as crypto from "node:crypto";

import type { FC } from "react";
import { renderToPipeableStream } from "react-dom/server";

import { pipeParsedHtml } from "@velnora/devkit";
import { type ClientRoute, GlobalRouter } from "@velnora/router/client";
import { createRouter } from "@velnora/router/server";
import type { RenderFn, WithDefault } from "@velnora/types";

import { Router } from "../../client/components/router";
import { getLayouts } from "../../client/utils/get-layouts";
import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";

export const appDirSsrHandler = (routes: ClientRoute<ReactRouteDescriptor>[]): RenderFn => {
  const pathRouteMap = new Map<string, ReactRouteDescriptor>(routes.map(r => [r.path, r.route]));

  return async ctx => {
    const route = pathRouteMap.get(ctx.path);

    if (!route) {
      // ToDo: Implement registering a 404 page route
      ctx.logger.warn(`No matching page found for path: ${ctx.path}`);
      return { status: 404 };
    }

    ctx.logger.log(`Rendering page for path: ${ctx.path} from module: ${route.module}`);

    const globalRouter = GlobalRouter.instance();
    const router = createRouter(ctx, globalRouter);

    const { default: Page } = await ctx.serverEnv.runner.import<WithDefault<FC>>(route.module);
    if (!Page) {
      ctx.logger.error(`No default export found in page module: ${route.module}`);
      return { status: 404 };
    }

    const layouts = await getLayouts(route);
    let page = <Page />;
    layouts.forEach((Layout, idx) => (page = <Layout key={route.layouts[idx]}>{page}</Layout>));
    page = <Router router={router}>{page}</Router>;

    const viteHtml = await ctx.transformRouteIndexHtml(ctx.route, "");
    const nonce = crypto.randomBytes(16).toString("base64");

    const parseHtmlStream = pipeParsedHtml(`<meta property="csp-nonce" nonce="${nonce}" />${viteHtml}`);

    const stream = renderToPipeableStream(page, {
      nonce,
      onShellReady() {
        stream.pipe(parseHtmlStream);
      },
      onError(error) {
        ctx.logger.error(`Error during SSR rendering for path: ${ctx.path}`);
        ctx.logger.error(error);
      },
      identifierPrefix: "_velnora_react_"
    });

    const connect = import.meta.env.DEV ? `connect-src 'self' ws: wss: http: https:` : `connect-src 'self'`;
    return {
      body: parseHtmlStream,
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Security-Policy": [
          `default-src 'self'`,
          // Allow scripts with this nonce (and same-origin scripts if you want)
          `script-src 'self' 'nonce-${nonce}'`,
          // If you use inline styles, either nonce them too or allow unsafe-inline (prefer nonce)
          `style-src 'self' 'nonce-${nonce}'`,
          `img-src 'self' data:`,
          connect, // Vite HMR uses WS in dev
          `object-src 'none'`,
          `base-uri 'self'`
        ].join("; ")
      }
    };
  };
};
