import { defineWebConfig } from "@velnora/tooling";

export default defineWebConfig({
  entries: {
    "velnora.router": "src/router/main.ts",
    "velnora.router.client": "src/client/main.ts",
    "velnora.router.server": "src/server/main.ts"
  }
});
