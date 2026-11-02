import { resolve } from "node:path";
import type { DevCommandOptions } from "@velnora/commands";
import type { VelnoraConfig } from "@velnora/types";
import _ from "lodash";

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
