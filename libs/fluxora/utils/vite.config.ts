import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("utils", {
  build: { lib: { entry: { "fluxora.utils.node": "src/node/main.ts" } } }
});
