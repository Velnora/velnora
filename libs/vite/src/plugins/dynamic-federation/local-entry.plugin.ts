import { type Plugin, defineConfig } from "vite";

import { appManager } from "@fluxora/common";
import type { App } from "@fluxora/types/core";
import type { RemoteApp } from "@fluxora/types/federation";
import { FEDERATION_MICRO_APP_IMPORT_RE } from "@fluxora/utils";

export const localEntryPlugin = (app: App): Plugin => {
  const allApps = appManager.getApps();

  return {
    name: "fluxora:core-plugins:federation:entry",

    apply(_, env) {
      return env.mode === "production";
    },

    async config() {
      const external = allApps.map(app => new RegExp(`^${app.name}(/.*)?$`));
      return defineConfig({ build: { rollupOptions: { external } } });
    },

    resolveId(id) {
      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        return id;
      }
    },

    load(id) {
      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        return `export {};`;
      }
    },

    async transformIndexHtml() {
      const remotes = allApps
        .filter(a => a.name !== app.name)
        .map<RemoteApp>(app => ({
          name: app.name,
          url: app.host,
          modules: Object.keys(app.config.exposedModules),
          format: "esm",
          from: "vite"
        }));

      return [
        {
          tag: "script",
          attrs: { id: "__remotes__", type: "application/json" },
          children: JSON.stringify(remotes),
          injectTo: "head"
        }
      ];
    },

    generateBundle() {}
  };
};
