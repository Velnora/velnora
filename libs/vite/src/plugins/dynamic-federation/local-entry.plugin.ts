import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { FEDERATION_MICRO_APP_IMPORT_RE } from "@fluxora/utils";

export const localEntryPlugin = (config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:federation:entry",

    apply(_, env) {
      return env.mode === "production";
    },

    async config() {
      const external = config.apps.map(app => new RegExp(`^${app.name}(/.*)?$`));
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
      const apps = config.apps
        .filter(app => app.name !== config.app.name)
        .map(async app => {
          // const appConfig = await loadAppConfig(app);
          // return { name: app.name, url: app.host.host, exposedModules: Object.keys(appConfig.exposedModules) };
        });

      const remotes = await Array.fromAsync(apps);

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
