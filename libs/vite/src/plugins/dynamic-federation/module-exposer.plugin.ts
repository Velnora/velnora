import type { Plugin } from "vite";

import type { AppConfig } from "@fluxora/types";
import type { FluxoraApp } from "@fluxora/types/core";
import { initialLoadExposedModules, projectFs } from "@fluxora/utils";

export const moduleExposerPlugin = (config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:federation:module-exposer",

    resolveId(id) {
      if (id === config.remoteEntry.entryPath) {
        return id;
      }
    },

    async load(id) {
      if (id === config.remoteEntry.entryPath) {
        await initialLoadExposedModules(config.app.name, config.exposedModules);
        const fs = projectFs(config.fluxoraRoot).cache.app(config.app.name);
        const appConfig = await fs.appConfig.readJson<AppConfig>();
        const files = Object.values(appConfig.exposedModules);
        return files.map(file => `export * from "${file}";`).join("\n");
      }
    }
  };
};
