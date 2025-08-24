import { Connect } from "vite";

import { APP_CONTAINER, VIRTUAL_ENTRIES } from "@velnora/utils";

import { Entity } from "../core";
import type { Inject } from "../types/inject";
import { injectHtmlTags } from "./inject-html-tags";

interface PipeableStream {
  abort: (reason?: unknown) => void;
  pipe: <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable;
}

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
      // const ssrRenderer = await frameworkRegistry.getSSRRenderer(entity.app);
      // const appClientJson = await entity.viteRunner.runner.import(VIRTUAL_ENTRIES.APP_CLIENT_JSON(entity.app.name));
      // const router = await resolveRoutes(appClientJson);
      //
      // const ctx = frameworkRegistry.getSSRRenderContext({
      //   app: entity.app,
      //   route: router.getWithFallback(entity.app.name, "/"),
      //   template: appCtx.projectStructure.template.getModule(entity.app.config.template)
      // });
      // const htmlStream = await ssrRenderer(ctx);

      const htmlStream = await entity.viteRunner.runner.import<PipeableStream>("");
      const transformStream = injectHtmlTags(tags);
      htmlStream.pipe(transformStream).pipe(res);
    } catch (e) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("Not Found");
      return;
    }
  };
};
