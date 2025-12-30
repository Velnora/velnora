import { defineWebConfig } from "@velnora/internal";

export default defineWebConfig({
  entries: { "velnora.devkit": "src/node/main.ts", "velnora.devkit.client": "src/client/main.ts" }
});
