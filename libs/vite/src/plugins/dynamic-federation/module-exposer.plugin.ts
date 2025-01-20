import { readFile } from "node:fs/promises";

import { type Plugin, defineConfig } from "vite";

import type { FluxoraAppConfig } from "@fluxora/types/core";
import { FEDERATION_INTERNALS, VITE_ENVIRONMENTS } from "@fluxora/utils";

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

    applyToEnvironment(env) {
      return env.name === VITE_ENVIRONMENTS.CLIENT;
    },

    async buildStart() {
      await initialLoadExposedModules(config.app.name, config.exposedModules);
    },

    resolveId(id) {
      if (id === config.remoteEntry.entryPath) {
        return FEDERATION_INTERNALS.REMOTE_ENTRY;
      }

      for (const [path, module] of config.exposedModules.entries()) {
        if (id === config.remoteEntry.entryPath.replace(".js", `/${module}.js`)) {
          return `/@fluxora:fs${path}`;
        }
      }
    },

    async load(id) {
      if (id === FEDERATION_INTERNALS.REMOTE_ENTRY) {
        return Array.from(config.exposedModules)
          .map(([module, name]) => `export * as ${name} from "${module}"`)
          .join("\n");
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
