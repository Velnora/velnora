import { readdir } from "fs/promises";
import { resolve } from "node:path";

import { type Plugin, defineConfig } from "vite";

import { CLIENT_ENTRY_FILE_EXTENSIONS, appCtx, findEntryFile } from "@fluxora/utils";

export const resolveLibPlugin = (): Plugin => {
  return {
    name: "fluxora:libs:resolve-lib",
    enforce: "pre",

    async config() {
      const { libs } = appCtx.userConfig.projectStructure || {};
      const libsRoot = resolve(libs?.dir || "libs");
      const libraries = await readdir(libsRoot);

      const alias: Record<string, string> = {};

      const libraryPromises = libraries.map(async library => {
        const libPath = resolve(libsRoot, library);
        const name = (await import(/* @vite-ignore */ resolve(libPath, "package.json"))).name;
        alias[name] = findEntryFile(libPath, "main", CLIENT_ENTRY_FILE_EXTENSIONS);
      });
      await Promise.all(libraryPromises);

      return defineConfig({ resolve: { alias } });
    }
  };
};
