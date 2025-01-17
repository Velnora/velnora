import { defineFluxoraConfig } from "@fluxora/vite";

export default defineFluxoraConfig("types", {
  build: {
    lib: {
      entry: {
        "fluxora.cli.types": "./src/cli/main.ts"
      }
    }
  }
});
