import type { Plugin } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";

import { PACKAGE_ENTRIES, PACKAGE_ORIGINALS } from "../../../const";
import { getEntryInTsconfig } from "../../../utils/get-entry-in-tsconfig";

export const fluxoraClientEntryDevPlugin = (_config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-client:dev",
    enforce: "pre",

    apply(_conf, env) {
      return env.mode === "development" && env.command === "serve";
    },

    resolveId(id) {
      let entry: string | null;

      if (id === PACKAGE_ENTRIES.FLUXORA_CLIENT && (entry = getEntryInTsconfig(PACKAGE_ORIGINALS.FLUXORA_CLIENT))) {
        return `/@fluxora:fs/${entry}`;
      }

      if (
        id === PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT &&
        (entry = getEntryInTsconfig(PACKAGE_ORIGINALS.FLUXORA_CLIENT_ENTRY_CLIENT_REACT))
      ) {
        return `/@fluxora:fs/${entry}`;
      }

      if (
        id === PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_SERVER_REACT &&
        (entry = getEntryInTsconfig(PACKAGE_ORIGINALS.FLUXORA_CLIENT_ENTRY_SERVER_REACT))
      ) {
        return `/@fluxora:fs/${entry}`;
      }
    }
  };
};
