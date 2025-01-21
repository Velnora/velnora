import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("worker", {
  build: {
    lib: { entry: { "fluxora.vite": "src/vite.ts" }, formats: ["es"] },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "EMPTY_BUNDLE") return;
        warn(warning);
      }
    }
  }
});
