import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import {
  NESTJS_PLUGIN_VIRTUAL_ENTRIES,
  NESTJS_PLUGIN_VIRTUAL_ENTRY_NAMES,
  PACKAGE_ENTRIES,
  PACKAGE_ORIGINALS,
  SERVER_ENTRY_FILE_EXTENSIONS,
  VIRTUAL_ALIAS_ENTRIES
} from "@fluxora/utils";

import { findEntryFile } from "../../utils/find-entry-file";

export const fluxoraServerEntryPlugin = async (config: FluxoraApp): Promise<Plugin> => {
  return {
    name: `fluxora:core-plugins:entry-server`,

    config() {
      return defineConfig({
        resolve: {
          alias: {
            [VIRTUAL_ALIAS_ENTRIES.APP_MODULE]: NESTJS_PLUGIN_VIRTUAL_ENTRIES.APP_MODULE,
            [VIRTUAL_ALIAS_ENTRIES.APP_CONFIG]: NESTJS_PLUGIN_VIRTUAL_ENTRIES.APP_CONFIG
          }
        }
      });
    },

    resolveId(id, importer) {
      if (id === PACKAGE_ENTRIES.FLUXORA_SERVER) {
        return this.resolve(PACKAGE_ORIGINALS.FLUXORA_SERVER, importer, { skipSelf: true });
      }

      if (id === PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY) {
        return this.resolve(PACKAGE_ORIGINALS.FLUXORA_SERVER_PROD_ENTRY, importer, { skipSelf: true });
      }

      if (id === NESTJS_PLUGIN_VIRTUAL_ENTRIES.APP_MODULE) {
        const root = config.app.root;
        return findEntryFile(root, "entry-server", SERVER_ENTRY_FILE_EXTENSIONS);
      }

      if (NESTJS_PLUGIN_VIRTUAL_ENTRY_NAMES.has(id)) {
        return id;
      }
    },

    load(id) {
      if (id === NESTJS_PLUGIN_VIRTUAL_ENTRIES.APP_CONFIG) {
        return `export const name = "${config.app.name}";`;
      }
    }
  };
};
