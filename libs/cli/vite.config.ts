import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), dtsPlugin({ rollupTypes: true })],
  esbuild: { target: "esnext" },
  build: {
    outDir: "build",
    target: "esnext",
    ssr: true,
    sourcemap: true,
    assetsInlineLimit: 0,
    emptyOutDir: true,
    lib: {
      entry: { "fluxora.cli": "src/main.ts" },
      name: "Fluxora CLI",
      formats: ["es"]
    },
    rollupOptions: {
      output: {
        chunkFileNames(chunkInfo) {
          return chunkInfo.isDynamicEntry && chunkInfo.facadeModuleId?.includes("commands")
            ? "commands/[name].[hash].js"
            : "chunks/[hash].js";
        }
      },
      external: [/@fluxora\/.*/]
    }
  }
});
