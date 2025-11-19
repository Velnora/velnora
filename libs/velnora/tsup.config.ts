import { defineWebConfig } from "@velnora/tooling";

export default defineWebConfig({
  entries: { "velnora": "src/main.ts", "velnora.app": "src/app.ts" }
});
