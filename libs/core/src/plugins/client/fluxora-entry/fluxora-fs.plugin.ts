import type { Plugin } from "vite";

export const fluxoraFsPlugin = (): Plugin => {
  return {
    name: "fluxora:core-plugins:fs",
    enforce: "pre",

    resolveId(id) {
      if (id.startsWith("/@fluxora:fs")) {
        return id;
      }
    },

    load(id) {
      if (id.startsWith("/@fluxora:fs")) {
        const file = id.split("/@fluxora:fs")[1];
        return `export * from "${file}"`;
      }
    }
  };
};
