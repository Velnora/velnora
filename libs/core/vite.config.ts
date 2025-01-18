import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("core", {
  define: { __DEV__: process.env.NODE_ENV === "development" },
  build: {
    lib: { entry: { "fluxora.worker": "src/worker.ts" } }
  }
});
