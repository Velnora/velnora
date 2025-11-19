import { merge } from "lodash";

import type { DevCommandOptions } from "@velnora/cli";
import type { VelnoraConfig } from "@velnora/schemas";

export const mergeConfig = (options: DevCommandOptions, config: VelnoraConfig): VelnoraConfig => {
  return merge<Partial<VelnoraConfig>, VelnoraConfig>(
    {
      mode: options.mode,
      root: options.root,
      server: {
        host: options.host,
        port: options.port,
        watch: options.watch ? {} : undefined
      }
    },
    config
  );
};
