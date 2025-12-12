import { readFile } from "node:fs/promises";

import type { HtmlTagDescriptor, Plugin } from "vite";

import type { Router } from "@velnora/router";
import { ssrTargetMode } from "@velnora/schemas";

import { defaultHtml } from "./default-html";

export const htmlPlugin = (router: Router): Plugin => {
  return {
    name: "velnora:initial-html-plugin",
    enforce: "pre",

    applyToEnvironment(env) {
      return env.config.consumer === "client";
    },

    transformIndexHtml: {
      order: "pre",
      async handler(pageHtml, ctx) {
        const url = router.parse(ctx.path);
        const parsedUrl = router.parse(ctx.path);
        const id = parsedUrl.query.get("id");

        if (url.query.has("ssr-mode") && url.query.get("ssr-mode") === ssrTargetMode.APP_DIR) {
          if (!id) return pageHtml;
          const route = router.getById(id);
          if (!route) return pageHtml;

          return {
            html: pageHtml,
            tags: [{ tag: "script", attrs: { type: "module", src: route.entry }, injectTo: "body" }]
          };
        }

        const tags: HtmlTagDescriptor[] = [{ tag: "div", attrs: { id: "root" }, injectTo: "body", children: pageHtml }];

        let html: string;
        if (!id) html = defaultHtml;
        else {
          const route = router.getById(id);
          if (!route || route.side !== "frontend" || route.renderMode !== "csr" || !route.indexHtmlFile)
            html = defaultHtml;
          else html = await readFile(route.indexHtmlFile, "utf-8");

          if (route) tags.push({ tag: "script", attrs: { type: "module", src: route.entry }, injectTo: "body" });
        }

        return { html, tags };
      }
    }
  };
};
