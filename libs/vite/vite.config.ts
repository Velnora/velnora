import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

console.log(process.env);

export default defineFluxoraConfig("vite", {
  define: { __IS_LIBRARY_DEVELOPMENT__: process.env.IS_LIB_DEVELOPMENT === "true" }
});
