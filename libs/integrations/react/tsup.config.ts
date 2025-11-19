import { defineWebConfig } from "@velnora/tooling";

export default defineWebConfig({
  entries: {
    "velnora.react": "src/main.ts",
    "velnora.react.client": "src/client/main.ts",
    "velnora.react.server": "src/server/main.ts"
  }
});
