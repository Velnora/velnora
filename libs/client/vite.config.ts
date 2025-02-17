import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("client", {
  build: {
    lib: {
      entry: {
        "fluxora.entry-client.react": "src/react/entry-client.ts",
        "fluxora.entry-server.react": "src/react/entry-server.ts",
        "fluxora.noop.react": "src/react/noop.ts",
        "fluxora.federation": "src/federation/main.tsx"
      }
    },
    rollupOptions: {
      external: ["/@vite/client"]
    }
  }
});
