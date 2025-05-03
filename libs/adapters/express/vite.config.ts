import { defineRootConfig } from "../../../scripts/define-root-config";

export default defineRootConfig("adapters.express", {
  build: {
    lib: { entry: { "velnora.adapters.express-adapter": "src/adapter/main.ts" } },
    rollupOptions: { external: [/^\/__virtual__\//] }
  }
});
