import { Connect } from "vite";

import { resolveRoutes } from "@velnora/router/node";
import { APP_CONTAINER, VIRTUAL_ENTRIES } from "@velnora/utils";

import { Entity, appCtx, frameworkRegistry } from "../core";
import type { Inject } from "../types/inject";
import { injectHtmlTags } from "./inject-html-tags";

export const adapterEntry = async (entity: Entity): Promise<Connect.NextHandleFunction> => {
  return async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);

    const tags: Inject[] = [
      {
        html: await entity.vite.transformIndexHtml(url.pathname, ""),
        injectTo: "head-prepend"
      },
      {
        tag: "script",
        attrs: { type: "module", src: VIRTUAL_ENTRIES.APP_CLIENT_ENTRY(entity.app.name) },
        injectTo: "body-prepend"
      }
    ];
    if (!entity.app.config.ssr) tags.push({ tag: "div", attrs: { id: APP_CONTAINER }, injectTo: "body" });

    try {
      const router = await resolveRoutes(entity);
      const route = router.getWithFallback(url.pathname, "/");

      const ctx = frameworkRegistry.getSSRRenderContext(entity, {
        route,
        template: appCtx.projectStructure.template.getModule(entity.app.config.template)
      });
      const renderer = await frameworkRegistry.getSSRRenderer(entity);
      const htmlStream = await renderer(ctx);
      const transformStream = injectHtmlTags(tags);
      htmlStream.pipe(transformStream).pipe(res);
    } catch (e) {
      console.log(e);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("Not Found");
      return;
    }
  };
};
