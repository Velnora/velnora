import { readFile } from "node:fs/promises";

import type { Plugin } from "vite";

import type { Router } from "@velnora/router";

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>____</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
  </body>
</html>`;

export const initialHtmlPlugin = (router: Router): Plugin => {
  return {
    name: "velnora:initial-html-plugin",
    enforce: "pre",

    applyToEnvironment(env) {
      return env.config.consumer === "client";
    },

    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const url = router.parse(ctx.path);
        if (url.query.has("ssr")) return html;

        const parsedUrl = router.parse(ctx.path);
        const id = parsedUrl.query.get("id");
        if (!id) return defaultHtml;
        const route = router.getById(id);
        if (!route || route.side !== "frontend" || route.renderMode !== "csr" || !route.indexHtmlFile)
          return defaultHtml;
        return readFile(route.indexHtmlFile, "utf-8");
      }
    }
  };
};
