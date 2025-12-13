import { defineWebConfig } from "@velnora/internal";

export default defineWebConfig({
  entries: {
    "velnora.react": "src/integration/main.ts",
    "velnora.react.client": "src/client/main.ts",
    "velnora.react.server": "src/server/main.ts"
  }
});
