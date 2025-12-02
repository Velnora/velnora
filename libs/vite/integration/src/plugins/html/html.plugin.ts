import type { PluginOption } from "vite";

import type { Router } from "@velnora/router";

import { initialHtmlPlugin } from "./initial-html.plugin";
import { injectHtmlPlugin } from "./inject-html.plugin";

export const htmlPlugin = (router: Router): PluginOption => {
  return [initialHtmlPlugin(router), injectHtmlPlugin(router)];
};
