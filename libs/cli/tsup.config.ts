import { defineNodeConfig } from "@velnora/tooling";

export default defineNodeConfig({
  entries: { "velnora.cli": "src/main.ts" },
  bannerBin: true
});
