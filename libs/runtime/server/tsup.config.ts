import { defineNodeConfig } from "@velnora/tooling";

export default defineNodeConfig({
  entries: { "velnora.runtime-server": "src/main.ts" }
});
