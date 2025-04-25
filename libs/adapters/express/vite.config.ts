import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("adapters.express", {
  build: {
    lib: { entry: { "fluxora.adapters.express-adapter": "src/adapter/main.ts" } },
    rollupOptions: { external: [/^\/__virtual__\//] }
  }
});
