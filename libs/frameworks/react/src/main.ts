import merge from "lodash.merge";

import { defineFramework, frameworkRegistry } from "@fluxora/framework-loader";
import { appCtx } from "@fluxora/runtime";
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
frameworkRegistry.register("@fluxora/framework-react", framework);
