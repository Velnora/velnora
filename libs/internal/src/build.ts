import type { BuildConfig } from "unbuild";

import { defineBaseConfig } from "./config/define-base-config";
import type { WithRequiredName } from "./types/with-required-name";

export const defineNodeConfig = (options: WithRequiredName<BuildConfig>) => {
  return defineBaseConfig(options, {
    rollup: {
      emitCJS: false
    }
  });
};

export const defineWebConfig = (options: WithRequiredName<BuildConfig>) => {
  return defineBaseConfig(options, {
    rollup: {
      inlineDependencies: true
    }
  });
};
