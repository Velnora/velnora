import type { Plugin } from "vite";

import type { AppConfig } from "@fluxora/types";
import type { FluxoraApp } from "@fluxora/types/core";
import { ErrorMessages, FEDERATION_MICRO_APP_IMPORT_RE, INTERNAL_PACKAGES, projectFs } from "@fluxora/utils";

export const localEntryDevPlugin = (config: FluxoraApp): Plugin => {
  const appConfigMap = new Map<string, AppConfig>();

  return {
    name: "fluxora:core-plugins:federation:dev-entry",

    apply(_, env) {
      return env.mode === "development";
    },

    async resolveId(id, importer) {
      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        const [appName, exposedModule] = id.split("/");
        const fs = projectFs(config.fluxoraRoot).cache.app(appName);
        const appConfig = await fs.appConfig.readJson<AppConfig>();

        appConfigMap.set(appName, appConfig);

        if (!exposedModule) {
          return config.remoteEntry.entryPath;
        }

        const foundModule = appConfig.exposedModules[exposedModule];
        if (!foundModule) return this.error(ErrorMessages.VITE_FEDERATION_MODULE_NOT_FOUND(exposedModule, appName));
        return INTERNAL_PACKAGES.EXPOSED_MODULES_APP(appName, exposedModule);
      }

      if (importer?.startsWith(INTERNAL_PACKAGES.EXPOSED_MODULES_APP("", "").slice(0, -1))) {
        const [appName, exposedModule] = importer.split("/").slice(3);
        const appConfig = appConfigMap.get(appName)!;
        return this.resolve(id, appConfig.exposedModules[exposedModule]!, { skipSelf: true });
      }

      if (id.startsWith(INTERNAL_PACKAGES.EXPOSED_MODULES_APP("", "").slice(0, -1))) {
        return id;
      }
    },

    async load(id) {
      if (id.startsWith(INTERNAL_PACKAGES.EXPOSED_MODULES_APP("", "").slice(0, -1))) {
        const [appName, exposedModule] = id.split("/").slice(3);
        const appConfig = appConfigMap.get(appName)!;
        return `export * from "${appConfig.exposedModules[exposedModule]!}";`;
      }
    }
  };
};
