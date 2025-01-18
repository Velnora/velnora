import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("server", {
  build: {
    lib: { entry: { "fluxora.entry-dev": "src/entry-dev.ts", "fluxora.entry-prod": "src/entry-prod.ts" } }
  }
});
