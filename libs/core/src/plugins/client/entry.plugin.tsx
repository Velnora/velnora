import { parse } from "node-html-parser";
import { type PluginOption } from "vite";

import { FEDERATION_PLUGIN_NAME, HTML_SCRIPT_TAG, PACKAGE_ENTRIES } from "../../const";

export const entryPlugin = (): PluginOption => {
  return {
    name: `${FEDERATION_PLUGIN_NAME}:entry`,

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
