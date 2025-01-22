import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { Plugin } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { initialLoadExposedModules } from "@fluxora/utils";

export const moduleExposerPlugin = (config: FluxoraApp): Plugin => {
  const module = resolve(config.cacheRoot, "apps", config.app.name, "modules", `${config.app.name}.ts`);

  return {
    name: "fluxora:core-plugins:federation:module-exposer",

    resolveId(id, importer) {
      if (id === config.remoteEntry.entryPath) {
        return id;
      }

      if (importer === config.remoteEntry.entryPath) {
        return this.resolve(id, module, { skipSelf: true });
      }
    },

    async load(id) {
      if (id === config.remoteEntry.entryPath) {
        await initialLoadExposedModules(config.app.name, config.exposedModules);
        return readFile(module, "utf-8");
      }
    }
  };
};
