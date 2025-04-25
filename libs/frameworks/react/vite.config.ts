import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("framework.react", {
  build: {
    lib: {
      entry: {
        "fluxora.framework.react-client": "src/client/main.ts",
        "fluxora.framework.react-ssr": "src/ssr/main.ts"
      }
    }
  }
});
