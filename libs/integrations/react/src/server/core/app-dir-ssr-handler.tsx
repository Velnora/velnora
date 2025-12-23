import * as crypto from "node:crypto";
import { Transform } from "node:stream";

import { JSDOM } from "jsdom";
import type { FC } from "react";
import { type BootstrapScriptDescriptor, renderToPipeableStream } from "react-dom/server";

import { type ClientRoute, GlobalRouter } from "@velnora/router/client";
import { createRouter } from "@velnora/router/server";
import type { RenderFn, WithDefault } from "@velnora/types";

import { Router } from "../../client/components/router";
import { getLayouts } from "../../client/utils/get-layouts";
import type { ReactRouteDescriptor } from "../../types/react-route-descriptor";
import { specialName } from "../utils/special-name";

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

    const viteSpecificScripts = await ctx.transformRouteIndexHtml(ctx.route, "");
    const dom = new JSDOM(viteSpecificScripts);

    const scripts = Array.from(dom.window.document.querySelectorAll("script")).map(script => ({
      content: script.textContent,
      attributes: Object.fromEntries(Array.from(script.attributes).map(attr => [attr.name, attr.value]))
    }));

    const {
      scripts: scriptScripts,
      contentScripts,
      moduleScripts,
      unknownScripts
    } = scripts.reduce(
      (acc, script) => {
        const baseDescriptor: Omit<BootstrapScriptDescriptor, "src"> = {
          integrity: script.attributes.integrity,
          crossOrigin: script.attributes.crossorigin
        };

        if (script.attributes.type === "module" && script.attributes.src) {
          acc.moduleScripts.push({ src: script.attributes.src, ...baseDescriptor });
        } else if (script.attributes.type === "module" && !script.attributes.src && script.content) {
          const name = specialName(crypto.createHash("sha256").update(script.content).digest("hex").slice(0, 6));
          const virtualSrc = ctx.vite.virtual(name, script.content, { global: name === "react/refresh" });
          acc.contentScripts.push({ ...baseDescriptor, src: virtualSrc });
        } else if (!script.attributes.type && script.attributes.src) {
          acc.scripts.push({ src: script.attributes.src, ...baseDescriptor });
        } else {
          acc.unknownScripts.push(script);
        }

        return acc;
      },
      {
        scripts: [] as BootstrapScriptDescriptor[],
        contentScripts: [] as BootstrapScriptDescriptor[],
        moduleScripts: [] as BootstrapScriptDescriptor[],
        unknownScripts: [] as typeof scripts
      }
    );

    if (unknownScripts.length > 0) {
      ctx.logger.warn(
        `Found ${unknownScripts.length} unknown script(s) during SSR for path: ${ctx.path}. These scripts will be ignored. Please contact with Velnora team if you need support for these script types.`
      );
    }

    const nonce = crypto.randomBytes(16).toString("base64");
    const htmlTransform = new Transform({
      transform(chunk, _enc, callback) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const stringChunk = chunk.toString() as string;

        const replacedString = stringChunk.replace(
          /<\/head>/i,
          `<meta property="csp-nonce" nonce="${nonce}" />` + `</head>`
        );

        callback(null, replacedString);
      }
    });

    const stream = renderToPipeableStream(page, {
      nonce,
      bootstrapModules: [...contentScripts, ...moduleScripts],
      bootstrapScripts: scriptScripts,
      onShellReady() {
        stream.pipe(htmlTransform);
      },
      onError(error) {
        ctx.logger.error(`Error during SSR rendering for path: ${ctx.path}`);
        ctx.logger.error(error);
      },
      identifierPrefix: "_velnora_react_"
    });

    const connect = import.meta.env.DEV ? `connect-src 'self' ws: wss: http: https:` : `connect-src 'self'`;
    return {
      body: htmlTransform,
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
