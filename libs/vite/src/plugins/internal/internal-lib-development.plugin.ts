import { resolve } from "node:path";

import { getTsconfig } from "get-tsconfig";
import { Plugin } from "vite";

const getInternalPackageInTsConfig = (id: string) => {
  const tsconfig = getTsconfig(process.env.NX_WORKSPACE_ROOT!);
  let baseUrl = tsconfig?.config.compilerOptions?.baseUrl;
  let paths = tsconfig?.config.compilerOptions?.paths || {};

  return baseUrl && paths && paths[id] ? resolve(tsconfig!.path, "..", baseUrl, paths[id][0]) : null;
};

export const internalLibDevelopmentPlugin = (): Plugin => {
  return {
    name: "fluxora:internal-plugins:development",
    enforce: "pre",

    resolveId(id, importer) {
      let entry: string | null;

      if ((entry = getInternalPackageInTsConfig(id))) {
        return this.resolve(entry, importer, { skipSelf: true });
      }
    }
  };
};
