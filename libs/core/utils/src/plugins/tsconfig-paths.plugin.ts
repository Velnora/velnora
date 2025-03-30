import { resolve } from "node:path";

import { resolveTsConfig } from "resolve-tsconfig";
import { TsConfigJson } from "type-fest";
import type { Plugin } from "vite";

import { PROJECT_CWD } from "../const";

export const tsconfigPathsPlugin = (): Plugin => {
  const root = __DEV__ ? PROJECT_CWD : process.cwd();
  const resolvedTsConfig = resolveTsConfig({
    filePath: resolve(root, "tsconfig.json")
  });
  const tsconfig = resolvedTsConfig.config?.options as TsConfigJson["compilerOptions"];
  const baseUrl = tsconfig?.baseUrl;
  const paths = tsconfig?.paths;

  return {
    name: "fluxora:internal:tsconfig-paths",

    resolveId: {
      order: "pre",
      handler(id) {
        if (id.startsWith("/__virtual__/")) return;
        if (!baseUrl || !paths) return;
        if (!paths[id]) return;
        return resolve(root, baseUrl, paths[id][0]);
      }
    }
  };
};
