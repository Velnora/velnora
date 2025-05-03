import { defineRootConfig } from "../../../scripts/define-root-config";

export default defineRootConfig("utils", {
  build: { lib: { entry: { "velnora.utils.node": "src/node/main.ts" } } }
});
