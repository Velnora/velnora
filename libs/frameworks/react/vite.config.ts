import { defineRootConfig } from "../../../scripts/define-root-config";

export default defineRootConfig("framework.react", {
  build: {
    lib: {
      entry: {
        "velnora.framework.react-client": "src/client/main.ts",
        "velnora.framework.react-ssr": "src/ssr/main.ts"
      }
    }
  }
});
