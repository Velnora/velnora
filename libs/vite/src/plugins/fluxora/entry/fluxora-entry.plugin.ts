import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import {
  CLIENT_ENTRY_FILE_EXTENSIONS,
  PACKAGE_ENTRIES,
  PACKAGE_ENTRY_NAMES,
  PACKAGE_ENTRY_ORIGINAL_MAPPING,
  PACKAGE_ORIGINALS,
  SERVER_ENTRY_FILE_EXTENSIONS,
  VIRTUAL_ALIAS_ENTRIES
} from "@fluxora/utils";

import { findEntryFile } from "../../../utils/find-entry-file";

export const fluxoraEntryPlugin = (config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-client",

    config() {
      const appEntry = findEntryFile(config.app.root, "entry-client", CLIENT_ENTRY_FILE_EXTENSIONS);
      const templatePath = config.template
        ? findEntryFile(config.template.root, "main", CLIENT_ENTRY_FILE_EXTENSIONS)
        : PACKAGE_ORIGINALS.FLUXORA_CLIENT_NOOP_REACT;

      return defineConfig({
        resolve: {
          alias: {
            // Common Aliases
            [VIRTUAL_ALIAS_ENTRIES.APP]: appEntry,
            [VIRTUAL_ALIAS_ENTRIES.TEMPLATE]: templatePath
          }
        }
      });
    },

    resolveId(id, importer) {
      if (PACKAGE_ENTRY_NAMES.has(id)) {
        const entry = PACKAGE_ENTRY_ORIGINAL_MAPPING[id as keyof typeof PACKAGE_ENTRY_ORIGINAL_MAPPING];
        return this.resolve(entry);
      }

      if (importer && PACKAGE_ENTRY_NAMES.has(importer)) {
        return this.resolve(id, importer, { skipSelf: true });
      }

      // Server Handling
      if (id === VIRTUAL_ALIAS_ENTRIES.APP_MODULE) {
        const root = config.app.root;
        return findEntryFile(root, "entry-server", SERVER_ENTRY_FILE_EXTENSIONS);
      }

      if (importer === VIRTUAL_ALIAS_ENTRIES.APP_MODULE) {
        const root = config.app.root;
        const file = findEntryFile(root, "entry-server", SERVER_ENTRY_FILE_EXTENSIONS);
        return this.resolve(id, file, { skipSelf: true });
      }

      if (id === VIRTUAL_ALIAS_ENTRIES.SSR_ENTRY) {
        return id;
      }
    },

    load(id) {
      if (id === VIRTUAL_ALIAS_ENTRIES.SSR_ENTRY) {
        return `export { EntryApp } from "${PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_SERVER_REACT}";`;
      }
    }
  };
};
