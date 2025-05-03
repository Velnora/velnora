import merge from "lodash.merge";

import { defineFramework, frameworkRegistry } from "@velnora/framework-loader";
import { appCtx } from "@velnora/runtime";
import react from "@vitejs/plugin-react-swc";

const rawConfig = appCtx.raw();

const framework = await defineFramework({
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
frameworkRegistry.register("@velnora/framework-react", framework);
