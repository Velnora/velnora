import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { VIRTUAL_ALIAS_ENTRIES, projectFs } from "@fluxora/utils";

export const fluxoraAppConfigPlugin = async (config: FluxoraApp): Promise<Plugin> => {
  return {
    name: "fluxora:core-plugins:app-config",

    config() {
      return defineConfig({
        resolve: {
          alias: {
            [VIRTUAL_ALIAS_ENTRIES.APP_CONFIG]: projectFs(config.fluxoraRoot).cache.app(config.app.name).appConfig.$raw
          }
        }
      });
    }
  };
};
