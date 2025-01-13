import { parse } from "node-html-parser";
import type { Plugin } from "vite";

import type { FluxoraApp } from "@fluxora/core";

import { HTML_SCRIPT_TAG, PACKAGE_ENTRIES } from "../../const";

export const entryAppHtml = (_config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-app-html",

    transformIndexHtml: {
      order: "pre",
      async handler(_, { server }) {
        const entryServerModule = await server!.ssrLoadModule(PACKAGE_ENTRIES.FLUXORA_SERVER);
        const renderHtml = entryServerModule!.renderHtml as () => string;
        const html = renderHtml();
        const root = parse(html);
        const head = root.querySelector("head")!;
        const container = head ? head : root;
        container.insertAdjacentHTML("afterbegin", HTML_SCRIPT_TAG);
        return `<!DOCTYPE html>${root.toString()}`;
      }
    }
  };
};
