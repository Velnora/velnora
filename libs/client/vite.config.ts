import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  mode: process.env.NODE_ENV,
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
      entry: {
        "fluxora.client": "src/main.ts",
        "fluxora.entry-client.react": "src/react/entry-client.ts",
        "fluxora.entry-server.react": "src/react/entry-server.ts"
      },
      name: "Fluxora Client",
      formats: ["es"]
    },
    rollupOptions: {
      external: [/^\/@fluxora\/\w+\/.*$/],
      output: { chunkFileNames: "chunks/[hash].js" }
    }
  }
});
