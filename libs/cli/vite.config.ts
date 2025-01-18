import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("cli", {
  build: {
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
