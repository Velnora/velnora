import { defineFluxoraConfig } from "../../scripts/define-fluxora-config";

export default defineFluxoraConfig("nestjs", {
  build: {
    lib: { entry: { "fluxora.nestjs.common": "src/common/main.ts" }, formats: ["es"] }
  }
});
