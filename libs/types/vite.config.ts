import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("types", {
  build: {
    lib: {
      entry: {
        "fluxora.cli.types": "./src/cli/main.ts",
        "fluxora.core.types": "./src/core/main.ts",
        "fluxora.worker.types": "./src/worker/main.ts"
      }
    }
  }
});
