import { type Plugin, defineConfig } from "vite";

import type { Package } from "@fluxora/types/core";
import { VIRTUAL_ALIAS_ENTRIES } from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

export const fluxoraAppConfigPlugin = async (app: Package): Promise<Plugin> => {
  return {
    name: "fluxora:core-plugins:app-config",

    config() {
      return defineConfig({
        resolve: {
          alias: {
            [VIRTUAL_ALIAS_ENTRIES.APP_CONFIG]: projectFs.cache.app(app.name).appConfig.$raw
          }
        }
      });
    }
  };
};
