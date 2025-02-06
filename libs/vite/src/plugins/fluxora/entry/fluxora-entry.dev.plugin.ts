import type { Plugin } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import {
  PACKAGE_ENTRIES,
  PACKAGE_ENTRY_NAMES,
  PACKAGE_ENTRY_ORIGINAL_MAPPING,
  PACKAGE_ORIGINALS
} from "@fluxora/utils";

import { getEntryInTsconfig } from "../../../utils/get-entry-in-tsconfig";

export const fluxoraEntryDevPlugin = (_config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-client:dev",
    enforce: "pre",

    apply(_conf, env) {
      return env.mode === "development" && env.command === "serve";
    },

    resolveId(id) {
      if (id === PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY) {
        return id;
      }

      if (PACKAGE_ENTRY_NAMES.has(id)) {
        return id;
      }
    },

    load(id) {
      if (id === PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY) {
        const entryInTsConfig = getEntryInTsconfig(PACKAGE_ORIGINALS.FLUXORA_SERVER_DEV_ENTRY);
        if (!entryInTsConfig) return;
        return `export * from "${entryInTsConfig}";`;
      }

      if (PACKAGE_ENTRY_NAMES.has(id)) {
        const entry = PACKAGE_ENTRY_ORIGINAL_MAPPING[id as keyof typeof PACKAGE_ENTRY_ORIGINAL_MAPPING];
        const entryInTsconfig = getEntryInTsconfig(entry);
        if (!entryInTsconfig) return;
        return `export * from "${entryInTsconfig}";`;
      }
    }
  };
};
