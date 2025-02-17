import { resolve } from "node:path";

import { getTsconfig } from "get-tsconfig";

export const getEntryInTsconfig = (id: string) => {
  const tsconfig = getTsconfig();
  let baseUrl = tsconfig?.config.compilerOptions?.baseUrl;
  let paths = tsconfig?.config.compilerOptions?.paths || {};

  return baseUrl && paths && paths[id] ? resolve(tsconfig!.path, "..", baseUrl, paths[id][0]) : null;
};
