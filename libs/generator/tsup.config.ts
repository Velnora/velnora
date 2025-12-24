import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  entries: { "velnora.generator": "src/main.ts" },
  external: ["lightningcss", "lightningcss/node"]
});
