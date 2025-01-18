import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import {
  CLIENT_ENTRY_FILE_EXTENSIONS,
  PACKAGE_ENTRIES,
  PACKAGE_ORIGINALS,
  VIRTUAL_ALIAS_ENTRIES,
  VIRTUAL_ENTRIES,
  VIRTUAL_ENTRY_NAMES,
  capitalize
} from "@fluxora/utils";

import { findEntryFile } from "../../utils/find-entry-file";

export const fluxoraClientEntryPlugin = (config: FluxoraApp): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-client",

    config() {
      return defineConfig({
        resolve: {
          alias: {
            [VIRTUAL_ALIAS_ENTRIES.APP]: VIRTUAL_ENTRIES.APP,
            [VIRTUAL_ALIAS_ENTRIES.TEMPLATE]: VIRTUAL_ENTRIES.TEMPLATE
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

      if (VIRTUAL_ENTRY_NAMES.has(id)) {
        return id;
      }
    },

    load(id) {
      if (id === VIRTUAL_ENTRIES.APP) {
        const appEntry = findEntryFile(config.app.root, "entry-client", CLIENT_ENTRY_FILE_EXTENSIONS);
        return `import * as App_client from "${appEntry}";\n\nexport const App = "${capitalize(config.app.name)}" in App_client ? App_client["${capitalize(config.app.name)}"] : "App" in App_client ? App_client["App"] : "default" in App_client ? App_client["default"] : () => { throw new Error("App not found"); };`;
      }

      if (id === VIRTUAL_ENTRIES.TEMPLATE) {
        let templatePath: string;
        return config.template &&
          (templatePath = findEntryFile(config.template.root, "main", CLIENT_ENTRY_FILE_EXTENSIONS))
          ? `import * as TemplateApp_client from "${templatePath}";\n\nexport const App = "Template" in TemplateApp_client ? TemplateApp_client["Template"] : "App" in TemplateApp_client ? TemplateApp_client["App"] : "default" in TemplateApp_client ? TemplateApp_client["default"] : ({ children }) => children;`
          : `export const App = ({ children }) => children;`;
      }
    }
  };
};
