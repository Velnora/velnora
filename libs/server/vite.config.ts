import { defineFluxoraConfig } from "@fluxora/vite";

export default defineFluxoraConfig("server", {
  build: {
    lib: { entry: { "fluxora.entry-dev": "src/entry-dev.ts", "fluxora.entry-prod": "src/entry-prod.ts" } }
  }
});
