import type { Plugin } from "vite";

import { initialLoadExposedModules } from "@fluxora/common";
import type { App } from "@fluxora/types/core";

export const moduleExposerPlugin = (app: App): Plugin => {
  return {
    name: "fluxora:core-plugins:federation:module-exposer",

    resolveId(id) {
      if (id === app.remoteEntry.entryPath) {
        return id;
      }
    },

    async load(id) {
      if (id === app.remoteEntry.entryPath) {
        await initialLoadExposedModules(app, app.config.exposedModules);
        const files = Object.keys(app.config.exposedModules);
        return files.map(file => `export * from "${file}";`).join("\n");
      }
    }
  };
};
