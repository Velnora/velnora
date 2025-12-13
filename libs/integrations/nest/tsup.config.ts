import { defineWebConfig } from "@velnora/internal";

export default defineWebConfig({
  entries: {
    "velnora.nest": "src/main.ts",
    "velnora.server": "src/server.ts"
  }
});
