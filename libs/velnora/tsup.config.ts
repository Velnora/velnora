import { defineWebConfig } from "@velnora/internal";

export default defineWebConfig({
  entries: { "velnora": "src/main.ts", "velnora.app": "src/app.ts" }
});
