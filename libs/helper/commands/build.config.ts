import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  name: "commands",
  entries: [{ input: "src/main", name: "velnora.commands" }]
});
