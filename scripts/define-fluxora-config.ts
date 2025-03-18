import type { InputOption } from "rollup";
import { type UserConfig, defineConfig, mergeConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export const defineFluxoraConfig = (appName: string, userConfig: UserConfig = {}) => {
  return defineFluxoraConfig.raw(appName, { [`fluxora.${appName}`]: "src/main.ts" }, userConfig);
};

defineFluxoraConfig.raw = (appName: string, libEntry: InputOption, userConfig: UserConfig = {}) => {
  return defineConfig(
    mergeConfig<UserConfig, UserConfig>(
      {
        mode: process.env.NODE_ENV || "development",
        plugins: [
          tsconfigPaths(),
          dtsPlugin({ rollupTypes: true, pathsToAliases: process.env.NODE_ENV === "development" })
        ],
        esbuild: { target: "esnext" },
        build: {
          outDir: "build",
          target: "esnext",
          ssr: true,
          sourcemap: true,
          emptyOutDir: true,
          lib: { entry: libEntry, name: `fluxora.${appName}`, formats: ["es"] },
          rollupOptions: {
            output: { chunkFileNames: "chunks/[hash].js" },
            external: [/@fluxora\/.*/]
          }
        }
      },
      userConfig
    )
  );
};
