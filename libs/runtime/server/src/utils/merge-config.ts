import { resolve } from "node:path";

import _ from "lodash";

import type { DevCommandOptions } from "@velnora/cli";
import type { VelnoraConfig } from "@velnora/types";

export const mergeConfig = (options: DevCommandOptions, config: VelnoraConfig): VelnoraConfig => {
  return _.merge<Partial<VelnoraConfig>, VelnoraConfig>(
    {
      mode: options.mode,
      root: resolve(options.root),
      server: {
        host: options.host,
        port: options.port,
        watch: options.watch ? {} : undefined
      }
    },
    config
  );
};
