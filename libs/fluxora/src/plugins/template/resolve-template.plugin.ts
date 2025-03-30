import type { Plugin } from "vite";

import { CLIENT_ENTRY_FILE_EXTENSIONS, VIRTUAL_ENTRIES, appCtx, findEntryFile } from "@fluxora/utils";

export const resolveTemplatePlugin = (): Plugin => {
  const templateEntryFile = findEntryFile(appCtx.projectStructure.template.path, "main", CLIENT_ENTRY_FILE_EXTENSIONS);

  return {
    name: "fluxora:resolve-template",
    enforce: "pre",

    resolveId(id) {
      if (id === VIRTUAL_ENTRIES.TEMPLATE) {
        return id;
      }
    },

    load(id) {
      if (id === VIRTUAL_ENTRIES.TEMPLATE) {
        return `
import * as template__import from "${templateEntryFile}";

const __templateImportName = ["Template", "App", "default"].find(__import => __import in template__import);
const TemplateApp = __templateImportName ? template__import[__templateImportName] : ({ children }) => children;
export default TemplateApp;
`.trimStart();
      }
    }
  };
};
