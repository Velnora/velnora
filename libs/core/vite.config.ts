import { defineFluxoraConfig } from "@fluxora/vite";

export default defineFluxoraConfig("core", {
  define: { __DEV__: process.env.NODE_ENV === "development" },
  build: {
    lib: { entry: { "fluxora.worker": "src/vite-dev-server-worker.ts" } }
  }
});
