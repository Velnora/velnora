import type { HtmlTagDescriptor, Plugin } from "vite";

import type { Router } from "@velnora/router";

export const injectHtmlPlugin = (router: Router): Plugin => {
  return {
    name: "velnora:inject-html-plugin",
    enforce: "post",

    applyToEnvironment(env) {
      return env.config.consumer === "client";
    },

    transformIndexHtml(html, ctx) {
      const url = router.parse(ctx.path);
      const descriptors: HtmlTagDescriptor[] = [];
      if (!url.query.has("ssr")) descriptors.push({ tag: "div", attrs: { id: "root" }, injectTo: "body" });

      if (url.query.has("id")) {
        const id = url.query.get("id")!;
        const route = router.getById(id);
        if (route && route.side === "frontend") {
          descriptors.push({ tag: "script", attrs: { type: "module", src: route.entry }, injectTo: "body" });
        }
      }

      return descriptors;
    }
  };
};
