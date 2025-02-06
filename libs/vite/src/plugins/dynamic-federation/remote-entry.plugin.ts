import type { HtmlTagDescriptor, Plugin } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { VITE_ENVIRONMENTS } from "@fluxora/utils";

export const remoteEntryPlugin = async (config: FluxoraApp): Promise<Plugin> => {
  const externalPkgs = new Map<string, string>();
  const hostApp = config.apps.find(app => app.isHost)!;

  return {
    name: "fluxora:core-plugins:federation:dynamic-federation:remote-entry",
    enforce: "pre",

    apply(_, env) {
      return env.command === "build";
    },

    applyToEnvironment(env) {
      return env.name === VITE_ENVIRONMENTS.CLIENT;
    },

    resolveId(id) {
      if (externalPkgs.has(id)) return;
      if (id.match(/^[.\/]/)) return;
      if (id.match(/^@fluxora\/(server|client)\/?.*/)) return;

      if (config.isHostApp()) {
        const refId = this.emitFile({ type: "chunk", fileName: `shared/${id}.js`, id });
        const filename = this.getFileName(refId);
        externalPkgs.set(id, filename);
        return;
      }
      return { id, external: true };
    },

    transformIndexHtml() {
      const descriptors: HtmlTagDescriptor[] = [];

      if (!config.isHostApp()) {
        descriptors.push({
          tag: "script",
          attrs: { type: "importmap", id: "__fluxora_remotes_importmap" },
          children: JSON.stringify({
            imports: Array.from(externalPkgs).reduce(
              (acc, [pkg, file]) => ({
                ...acc,
                [pkg]: new URL(file, hostApp.host.host).href
              }),
              {} as Record<string, string>
            )
          }),
          injectTo: "head"
        });
      } else {
        for (const [, file] of externalPkgs) {
          descriptors.push({
            tag: "link",
            attrs: { rel: "modulepreload", href: `/${file}` },
            injectTo: "head-prepend"
          });
        }
      }

      return descriptors;
    }
  };
};
