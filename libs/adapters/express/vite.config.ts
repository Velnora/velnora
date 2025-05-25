import { defineRootConfig } from "../../../scripts/define-root-config";

export default defineRootConfig("adapters.express", {
  build: {
    rollupOptions: { external: [/^\/__virtual__\//] }
  }
});
