import { readFile } from "node:fs/promises";

import { type Plugin, defineConfig } from "vite";

import type { FluxoraAppConfig } from "@fluxora/types/core";
import { FEDERATION_INTERNALS } from "@fluxora/utils";

import { handleDirectives } from "../../utils/handle-directives";
import { initialLoadExposedModules } from "../../utils/initial-load-exposed-modules";

export const moduleExposerPlugin = (config: FluxoraAppConfig): Plugin => {
  return {
    name: "fluxora:core-plugins:dynamic-federation:module-exposer",
    enforce: "pre",

    config() {
      const exposedModulesArray = Array.from(config.exposedModules.values());
      if (exposedModulesArray.length === 0) return;
      const entries = exposedModulesArray.map(module => config.remoteEntry.entryPath.replace(".js", `/${module}.js`));
      return defineConfig({ build: { lib: { entry: entries, formats: ["es"] } } });
    },

    async buildStart() {
      await initialLoadExposedModules(config.app.name, config.exposedModules);
    },

    resolveId(id) {
      if (id === config.remoteEntry.entryPath) {
        return FEDERATION_INTERNALS.REMOTE_ENTRY;
      }

      for (const module of config.exposedModules.values()) {
        if (id === config.remoteEntry.entryPath.replace(".js", `/${module}.js`)) {
          return FEDERATION_INTERNALS.SINGLE_REMOTE_ENTRY(module);
        }
      }
    },

    async load(id) {
      if (id === FEDERATION_INTERNALS.REMOTE_ENTRY) {
        return Array.from(config.exposedModules)
          .map(([module, name]) => `export * as ${name} from "${module}"`)
          .join("\n");
      }

      for (const module of config.exposedModules.values()) {
        if (id === FEDERATION_INTERNALS.SINGLE_REMOTE_ENTRY(module)) {
          const entryFile = Array.from(config.exposedModules.entries()).find(([, name]) => name === module);
          if (!entryFile) return;
          return `export * from "${entryFile[0]}"`;
        }
      }
    },

    transform: {
      order: "pre",
      handler(code, id) {
        handleDirectives(code, id, config.exposedModules);
      }
    },

    async watchChange(id, event) {
      if (event.event === "delete") {
        config.exposedModules.delete(id);
      } else {
        const code = await readFile(id, "utf-8");
        handleDirectives(code, id, config.exposedModules);
      }
    }
  };
};
