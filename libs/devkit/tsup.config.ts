import { defineWebConfig } from "@velnora/tooling";

export default defineWebConfig({
  entries: { "velnora.devkit": "src/client/main.ts", "velnora.devkit.vite": "src/vite/main.ts" }
});
