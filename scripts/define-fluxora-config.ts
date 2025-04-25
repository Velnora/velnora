import * as process from "node:process";

import type { InputOption } from "rollup";
import { type UserConfig, defineConfig, mergeConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import { swcPlugin } from "../libs/fluxora/dev/src/plugins/swc.plugin";

const PROJECT_CWD = process.env.PROJECT_CWD || process.cwd();

export const defineFluxoraConfig = (appName: string, userConfig: UserConfig = {}) => {
  return defineFluxoraConfig.raw(appName, { [`fluxora.${appName}`]: "src/main.ts" }, userConfig);
};

defineFluxoraConfig.dev = (userConfig: UserConfig = {}) =>
  defineFluxoraConfig.raw("__development-script__", {}, userConfig);

defineFluxoraConfig.raw = (appName: string, libEntry: InputOption, userConfig: UserConfig = {}) => {
  return defineConfig(
    mergeConfig<UserConfig, UserConfig>(
      {
        ssr: { noExternal: [/^@swc\/helpers/] },
        mode: process.env.NODE_ENV || "development",
        define: { __DEV__: process.env.NODE_ENV === "development" },
        plugins: [
          swcPlugin(),
          tsconfigPaths({ root: PROJECT_CWD, projects: ["tsconfig.json"], loose: true }),
          dtsPlugin({ rollupTypes: true, pathsToAliases: false })
        ],
        esbuild: false,
        build: {
          outDir: "build",
          target: "esnext",
          ssr: true,
          sourcemap: true,
          emptyOutDir: true,
          lib: { entry: libEntry, name: `fluxora.${appName}`, formats: ["es"] },
          rollupOptions: {
            output: { chunkFileNames: "chunks/[hash].js" },
            external: [/@fluxora\/.*/, /^\/__virtual__\//]
          }
        }
      },
      userConfig
    )
  );
};
