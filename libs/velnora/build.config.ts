import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  name: "velnora",
  entries: [{ input: "src/app.ts", name: "velnora.app" }]
});
