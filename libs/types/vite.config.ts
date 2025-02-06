import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("types", {
  build: {
    lib: {
      entry: {
        "fluxora.cli.types": "./src/cli/main.ts",
        "fluxora.core.types": "./src/core/main.ts",
        "fluxora.utils.types": "./src/utils/main.ts",
        "fluxora.worker.types": "./src/worker/main.ts"
      }
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "EMPTY_BUNDLE") return;
        warn(warning);
      }
    }
  }
});
