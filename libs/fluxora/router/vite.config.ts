import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("router", {
  build: { lib: { entry: { "fluxora.router-node": "src/node.main.ts" } } }
});
