import { defineRootConfig } from "../../scripts/define-root-config";

export default defineRootConfig("nestjs", {
  build: {
    lib: { entry: { "velnora.nestjs.common": "src/common/main.ts" }, formats: ["es"] }
  }
});
