import { defineFluxoraConfig } from "@fluxora/vite";

export default defineFluxoraConfig("client", {
  build: {
    lib: {
      entry: {
        "fluxora.entry-client.react": "src/react/entry-client.ts",
        "fluxora.entry-server.react": "src/react/entry-server.ts"
      }
    }
  }
});
