import { defineFluxoraConfig } from "../../../scripts/define-fluxora-config";

export default defineFluxoraConfig.raw(
  "framework.react",
  {
    "fluxora.framework.react-client": "src/main.ts",
    "fluxora.framework.react-server": "src/server/main.ts",
    "fluxora.framework.vite": "src/vite.ts"
  },
  { build: { rollupOptions: { external: [/^\/__virtual__\//] } } }
);
