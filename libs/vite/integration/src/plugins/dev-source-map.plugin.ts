import { resolve } from "node:path";

import type { Plugin, ResolvedConfig } from "vite";

import type { VelnoraConfig } from "@velnora/schemas";

export const devSourceMapPlugin = (velnoraConfig: VelnoraConfig): Plugin => {
  let config: ResolvedConfig = null!;

  return {
    name: "velnora:dev:sourcemap",
    enforce: "post",
    apply: "serve",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    transform(code) {
      const map = this.getCombinedSourcemap?.();
      if (!map || !Array.isArray(map.sources)) return null;

      const rewrite = (path: string) => {
        if (path.match(/node_modules\/(rolldown-)?vite\/dist\/client\//)) {
          const [, rolldown, module] = path.split(/node_modules\/(rolldown-)?vite\/dist\/client\//);
          const viteModule = rolldown === "rolldown-" ? `vite-rolldown` : "vite";
          return `vite://internals/${viteModule}/${module}`;
        }

        if (path.startsWith(config.cacheDir)) {
          return `vite://cache/${path.slice(config.cacheDir.length + 1)}`;
        }

        // const cacheDirName = velnoraConfig.cacheDir.slice(process.cwd().length + 1);
        // if (path.startsWith(`velnora://apps/${cacheDirName}`)) {
        //   return `velnora://cache/${path.slice(`velnora://apps/${cacheDirName}`.length + 1)}`;
        // }

        if (process.env.PROJECT_CWD && path.startsWith(resolve(process.env.PROJECT_CWD, "libs"))) {
          return `velnora://workspace/${path.slice(resolve(process.env.PROJECT_CWD, "libs").length + 1)}`;
        }

        return path;
      };

      map.sources = map.sources.map(rewrite);
      return { code, map };
    }
  };
};
