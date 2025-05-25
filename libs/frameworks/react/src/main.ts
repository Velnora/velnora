import merge from "lodash.merge";

import { appCtx } from "@velnora/runtime";
import { defineFramework } from "@velnora/utils/node";
import react from "@vitejs/plugin-react-swc";

const rawConfig = appCtx.raw();

export default defineFramework({
  plugins: [
    react({
      ...(rawConfig.react || {}),
      tsDecorators: true,
      useAtYourOwnRisk_mutateSwcOptions(options) {
        options = merge(options, {
          jsc: {
            target: "esnext",
            parser: { syntax: "typescript", decorators: true },
            transform: { legacyDecorator: true, decoratorMetadata: true, useDefineForClassFields: false },
            externalHelpers: true
          },
          module: { type: "es6" }
        });
      }
    })
  ]
});
