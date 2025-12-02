import type { HtmlTagDescriptor, Plugin } from "vite";

import type { Router } from "@velnora/router";

export const injectHtmlPlugin = (router: Router): Plugin => {
  return {
    name: "velnora:inject-html-plugin",
    enforce: "post",

    applyToEnvironment(env) {
      return env.config.consumer === "client";
    },

    transformIndexHtml(_html, ctx) {
      const descriptors: HtmlTagDescriptor[] = [{ tag: "div", attrs: { id: "root" }, injectTo: "body" }];

      const parsedUrl = router.parse(ctx.path);
      if (parsedUrl.query.has("id")) {
        const id = parsedUrl.query.get("id")!;
        const route = router.getById(id);
        if (route && route.side === "frontend") {
          descriptors.push({ tag: "script", attrs: { type: "module", src: route.entry }, injectTo: "body" });
        }
      }

      return descriptors;
    }
  };
};
