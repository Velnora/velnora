import type { Plugin } from "vite";

export const virtualModulePlugin = (virtualModules: Map<string, string>): Plugin => {
  return {
    name: "velnora:virtual",

    resolveId(id) {
      if (virtualModules.has(id)) return id;
    },

    load(id) {
      if (virtualModules.has(id)) return virtualModules.get(id);
    }
  };
};
