import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { VIRTUAL_ALIAS_ENTRIES, capitalize } from "@fluxora/utils";

export const fluxoraAppConfigPlugin = async (config: FluxoraApp): Promise<Plugin> => {
  const appConfigurationFile = resolve(config.cacheRoot, "apps", config.app.name, "app-config.ts");

  const appConfig = {
    name: config.app.name,
    componentName: capitalize(config.app.name)
  };

  return {
    name: "fluxora:core-plugins:app-config",

    config() {
      return defineConfig({
        resolve: {
          alias: {
            [VIRTUAL_ALIAS_ENTRIES.APP_CONFIG]: appConfigurationFile
          }
        }
      });
    },

    async buildStart() {
      const content = Object.entries(appConfig)
        .map(([key, value]) => `export const ${key} = "${value}";`)
        .join("\n");

      await mkdir(dirname(appConfigurationFile), { recursive: true });
      await writeFile(appConfigurationFile, content);
    }
  };
};
