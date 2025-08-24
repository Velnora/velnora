import { Plugin } from "vite";

import { PROJECT_CWD } from "@velnora/utils/node";

declare const __DEV__: boolean;

export const devSourceMapPlugin = (): Plugin => {
  return {
    name: "velnora:dev:sourcemap",
    enforce: "post",
    apply: "serve",

    async transform(code, id) {
      if (!/\.(m?[tj]sx?|css|scss|sass|less|vue|svelte)$/.test(id)) return null;

      const map = this.getCombinedSourcemap?.();
      if (!map || !Array.isArray(map.sources)) return null;

      const rewrite = (path: string) => {
        if (path.startsWith("/@app:")) {
          return `velnora://app/${path.slice(6)}`;
        }

        if (path.includes("node_modules/vite/dist/client/")) {
          const [, module] = path.split("node_modules/vite/dist/client/");
          return `vite://internals/${module}`;
        }

        if (__DEV__ && path.startsWith(PROJECT_CWD + "/libs")) {
          const lib = path.slice(PROJECT_CWD.length + 6);
          const [module, ...modules] = lib.split("/");

          if (module === "velnora") {
            return `velnora://core/${modules.join("/")}`;
          }

          return `velnora://${module}/${modules.join("/")}`;
        }

        if (path.includes("node_modules")) {
          const [, module] = path.split("node_modules");
          return `vite://node_modules/${module}`;
        }

        return path;
      };

      map.sources = map.sources.map(rewrite);
      // Optional: set a sourceRoot (not required when using fully-qualified sources)
      // map.sourceRoot = ''

      return { code, map };
    }
  };
};
