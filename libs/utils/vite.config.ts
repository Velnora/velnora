import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("utils", {
  build: { lib: { entry: { "fluxora.node": "src/node.ts" } } }
});
