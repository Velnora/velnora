import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  name: "velnora",
  entries: { "velnora.app": "src/app.ts" }
});
