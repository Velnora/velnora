import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  mode: process.env.NODE_ENV,
  plugins: [tsconfigPaths(), dtsPlugin({ rollupTypes: true })],
  esbuild: { target: "esnext" },
  define: { __DEV__: process.env.NODE_ENV === "development" },
  build: {
    outDir: "build",
    target: "esnext",
    ssr: true,
    sourcemap: true,
    assetsInlineLimit: 0,
    emptyOutDir: true,
    lib: {
      entry: { "fluxora.core": "src/main.ts", "fluxora.worker": "src/vite-dev-server-worker.ts" },
      name: "Fluxora Core",
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
