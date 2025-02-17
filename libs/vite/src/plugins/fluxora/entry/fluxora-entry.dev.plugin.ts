import type { Plugin } from "vite";

import { appManager } from "@fluxora/common";
import {
  PACKAGE_ENTRIES,
  PACKAGE_ENTRY_NAMES,
  PACKAGE_ENTRY_ORIGINAL_MAPPING,
  PACKAGE_ORIGINALS
} from "@fluxora/utils";

import { getEntryInTsconfig } from "../../../utils/get-entry-in-tsconfig";

export const fluxoraEntryDevPlugin = (): Plugin => {
  const libs = appManager.getLibs();
  const libNamePathMapping = new Set(libs.map(lib => lib.packageJson.name));

  return {
    name: "fluxora:core-plugins:entry-client:dev",
    enforce: "pre",

    apply(_conf, env) {
      return env.mode === "development" && env.command === "serve";
    },

    resolveId(id) {
      let entry: string | null;
      if (libNamePathMapping.has(id) && (entry = getEntryInTsconfig(id))) {
        return this.resolve(entry);
      }

      if (id === PACKAGE_ENTRIES.SERVER_ENTRY) {
        return id;
      }

      if (PACKAGE_ENTRY_NAMES.has(id)) {
        return id;
      }
    },

    load(id) {
      if (id === PACKAGE_ENTRIES.SERVER_ENTRY) {
        return `export * from "${PACKAGE_ORIGINALS.SERVER_ENTRY_DEV}";`;
      }

      if (PACKAGE_ENTRY_NAMES.has(id)) {
        return `export * from "${PACKAGE_ENTRY_ORIGINAL_MAPPING[id as keyof typeof PACKAGE_ENTRY_ORIGINAL_MAPPING]}";`;
      }
    }
  };
};
