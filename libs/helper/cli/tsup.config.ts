import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  entries: { "velnora.cli-helper": "src/main.ts" },
  bannerBin: true
});
