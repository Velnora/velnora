import { defineNodeConfig } from "@velnora/tooling";

export default defineNodeConfig({
  entries: { "velnora.cli-helper": "src/main.ts" },
  bannerBin: true
});
