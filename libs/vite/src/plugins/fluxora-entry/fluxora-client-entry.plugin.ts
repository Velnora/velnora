import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import {
  CLIENT_ENTRY_FILE_EXTENSIONS,
  PACKAGE_ENTRIES,
  PACKAGE_ORIGINALS,
  VIRTUAL_ALIAS_ENTRIES
} from "@fluxora/utils";

import { findEntryFile } from "../../utils/find-entry-file";

export const fluxoraClientEntryPlugin = (config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-client",

    config() {
      const appEntry = findEntryFile(config.app.root, "entry-client", CLIENT_ENTRY_FILE_EXTENSIONS);
      const templatePath = config.template
        ? findEntryFile(config.template.root, "main", CLIENT_ENTRY_FILE_EXTENSIONS)
        : VIRTUAL_ALIAS_ENTRIES.NOOP;

      return defineConfig({
        resolve: {
          alias: {
            [VIRTUAL_ALIAS_ENTRIES.APP]: appEntry,
            [VIRTUAL_ALIAS_ENTRIES.TEMPLATE]: templatePath
          }
        }
      });
    },

    async resolveId(id, importer) {
      if (id === PACKAGE_ENTRIES.FLUXORA_CLIENT) {
        return this.resolve(PACKAGE_ORIGINALS.FLUXORA_CLIENT, importer, { skipSelf: true });
      }

      if (id === PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT) {
        return this.resolve(PACKAGE_ORIGINALS.FLUXORA_CLIENT_ENTRY_CLIENT_REACT, importer, { skipSelf: true });
      }

      if (id === PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_SERVER_REACT) {
        return this.resolve(PACKAGE_ORIGINALS.FLUXORA_CLIENT_ENTRY_SERVER_REACT, importer, { skipSelf: true });
      }

      if (id === VIRTUAL_ALIAS_ENTRIES.NOOP) {
        return this.resolve(PACKAGE_ORIGINALS.FLUXORA_CLIENT_NOOP_REACT, importer, { skipSelf: true });
      }
    }
  };
};
