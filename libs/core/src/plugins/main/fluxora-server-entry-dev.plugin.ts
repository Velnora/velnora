import { type Plugin } from "vite";

import { PACKAGE_ENTRIES, PACKAGE_ORIGINALS } from "../../const";
import type { FluxoraApp } from "../../types";
import { getEntryInTsconfig } from "../../utils/get-entry-in-tsconfig";

export const fluxoraServerEntryDevPlugin = async (_config: FluxoraApp): Promise<Plugin> => {
  return {
    name: `fluxora:core-plugins:entry-server:dev`,

    apply(_conf, env) {
      return env.mode === "development" && env.command === "serve";
    },

    resolveId(id) {
      let entry: string | null;

      if (id === PACKAGE_ENTRIES.FLUXORA_SERVER && (entry = getEntryInTsconfig(PACKAGE_ORIGINALS.FLUXORA_SERVER))) {
        return entry;
      }

      if (
        id === PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY &&
        (entry = getEntryInTsconfig(PACKAGE_ORIGINALS.FLUXORA_SERVER_DEV_ENTRY))
      ) {
        return entry;
      }
    }
  };
};
