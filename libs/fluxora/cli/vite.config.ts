import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("cli", {
  build: {
    rollupOptions: {
      output: {
        chunkFileNames(chunk) {
          if (chunk.facadeModuleId?.includes("commands")) {
            const cmdName = chunk.facadeModuleId
              .split("commands")
              .at(1)!
              .slice(1, -3)
              .replace(/\/index$/, "")
              .split("/")
              .join("-");

            return `commands/${cmdName}.js`;
          }
          return "chunks/[hash].js";
        }
      }
    }
  }
});
