import { defineWebConfig } from "@velnora/tooling";

export default defineWebConfig({
  entries: {
    "velnora.nest": "src/main.ts",
    "velnora.server": "src/server.ts"
  }
});
