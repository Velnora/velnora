import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("core", {
  build: {
    lib: { entry: { "fluxora.worker": "src/worker.ts" } }
  }
});
