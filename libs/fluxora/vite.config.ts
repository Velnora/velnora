import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("core", {
  define: {
    __DEV__: process.env.NODE_ENV === "development"
  },
  build: {
    lib: { entry: { "fluxora.cli": "src/cli.ts" } },
    rollupOptions: {
      output: {
        chunkFileNames(chunkInfo) {
          return chunkInfo.isDynamicEntry && chunkInfo.facadeModuleId?.includes("commands")
            ? "commands/[name].[hash].js"
            : "chunks/[hash].js";
        }
      }
    }
  }
});
