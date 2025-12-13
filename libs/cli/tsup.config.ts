import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  entries: { "velnora.cli": "src/main.ts" },
  bannerBin: true
});
