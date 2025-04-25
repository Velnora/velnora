import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("environment-node", {
  build: { lib: { entry: { "fluxora.environment-node.runner": "src/runner/main.ts" } } }
});
