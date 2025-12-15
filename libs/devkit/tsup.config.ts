import { defineWebConfig } from "@velnora/internal";

export default defineWebConfig({
  entries: { "velnora.devkit": "src/client/main.ts", "velnora.devkit.node": "src/node/main.ts" }
});
