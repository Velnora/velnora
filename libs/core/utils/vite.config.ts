import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig("utils", {
  define: {
    __DEV__: process.env.NODE_ENV === "development"
  }
});
