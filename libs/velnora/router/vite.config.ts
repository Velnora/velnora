import { defineRootConfig } from "../../../scripts/define-root-config";

export default defineRootConfig("router", {
  build: { lib: { entry: { "velnora.router-node": "src/node/main.ts" } } }
});
