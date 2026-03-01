import { defineNodeConfig } from "@velnora/internal";

export default defineNodeConfig({
  name: "cli",
  build: { lib: { entry: { bin: "src/bin.ts" } } },
  define: { NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production") }
});
