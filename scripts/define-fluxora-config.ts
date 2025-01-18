import { UserConfig, defineConfig, mergeConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export const defineFluxoraConfig = (appName: string, userConfig: UserConfig = {}) => {
  return defineConfig(
    mergeConfig<UserConfig, UserConfig>(
      {
        mode: process.env.NODE_ENV,
        plugins: [tsconfigPaths(), dtsPlugin({ rollupTypes: true })],
        esbuild: { target: "esnext" },
        build: {
          outDir: "build",
          target: "esnext",
          ssr: true,
          sourcemap: true,
          emptyOutDir: true,
          lib: { entry: { [`fluxora.${appName}`]: "src/main.ts" }, name: `fluxora ${appName}`, formats: ["es"] },
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
