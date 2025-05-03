import { defineRootConfig } from "../../../scripts/define-root-config";

export default defineRootConfig("environment-node", {
  build: { lib: { entry: { "velnora.environment-node.runner": "src/runner/main.ts" } } }
});
