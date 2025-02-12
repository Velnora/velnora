import type { Plugin } from "vite";

import { appManager } from "@fluxora/common";
import { ErrorMessages, FEDERATION_MICRO_APP_IMPORT_RE, INTERNAL_PACKAGES } from "@fluxora/utils";

export const localEntryDevPlugin = (): Plugin => {
  return {
    name: "fluxora:core-plugins:federation:dev-entry",

    apply(_, env) {
      return env.mode === "development";
    },

    async resolveId(id, importer) {
      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        const [appName, exposedModule] = id.split("/");
        const foundApp = appManager.getApp(appName);
        if (!foundApp) return this.error(ErrorMessages.VITE_FEDERATION_APP_NOT_FOUND(appName));

        if (!exposedModule) {
          return foundApp.remoteEntry.entryPath;
        }

        const foundModule = Object.fromEntries(Object.entries(foundApp.config.exposedModules).map(([v, k]) => [k, v]))[
          exposedModule
        ];
        if (!foundModule) return this.error(ErrorMessages.VITE_FEDERATION_MODULE_NOT_FOUND(exposedModule, appName));
        return INTERNAL_PACKAGES.EXPOSED_MODULES_APP(appName, exposedModule);
      }

      if (importer?.startsWith(INTERNAL_PACKAGES.EXPOSED_MODULES_APP("", "").slice(0, -1))) {
        const [appName, exposedModule] = importer.split("/").slice(3);
        const foundApp = appManager.getApp(appName);
        if (!foundApp) return this.error(ErrorMessages.VITE_FEDERATION_APP_NOT_FOUND(appName));
        return this.resolve(id, foundApp.config.exposedModules[exposedModule]!, { skipSelf: true });
      }

      if (id.startsWith(INTERNAL_PACKAGES.EXPOSED_MODULES_APP("", "").slice(0, -1))) {
        return id;
      }
    },

    async load(id) {
      if (id.startsWith(INTERNAL_PACKAGES.EXPOSED_MODULES_APP("", "").slice(0, -1))) {
        const [appName, exposedModule] = id.split("/").slice(3);
        const foundApp = appManager.getApp(appName);
        if (!foundApp) return this.error(ErrorMessages.VITE_FEDERATION_APP_NOT_FOUND(appName));
        const module = Object.fromEntries(Object.entries(foundApp.config.exposedModules).map(([v, k]) => [k, v]))[
          exposedModule
        ];
        if (!module) return this.error(ErrorMessages.VITE_FEDERATION_MODULE_NOT_FOUND(exposedModule, appName));
        return `export * from "${module}";`;
      }
    }
  };
};
