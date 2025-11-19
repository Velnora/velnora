import { defineNodeConfig } from "@velnora/tooling";

export default defineNodeConfig({
  entries: { "velnora.rpc": "src/main.ts" }
});
