import type { Plugin } from "vite";

import { type App, AppType, type Package } from "@fluxora/types/core";
import { VIRTUAL_ALIAS_ENTRIES } from "@fluxora/utils";

export const fluxoraAppConfigPlugin = async (app: Package): Promise<Plugin> => {
  return {
    name: "fluxora:core-plugins:app-config",
    enforce: "pre",

    apply() {
      return app.type === AppType.APPLICATION;
    },

    resolveId(id) {
      if (id === VIRTUAL_ALIAS_ENTRIES.APP_CONFIG) {
        return VIRTUAL_ALIAS_ENTRIES.APP_CONFIG;
      }
    },

    load(id) {
      if (id === VIRTUAL_ALIAS_ENTRIES.APP_CONFIG) {
        return JSON.stringify((app as App).config);
      }
    }
  };
};
