import { resolve } from "node:path";

import type { DevCommandOptions } from "@velnora/commands";
import { velnoraConfigSchema } from "@velnora/contracts";
import { loadConfigFile } from "@velnora/devkit";
import type { VelnoraConfig } from "@velnora/types";

import { mergeConfig } from "./merge-config";

export const loadAndMergeConfig = async (options: DevCommandOptions) => {
  const config = await loadConfigFile<VelnoraConfig>(resolve(options.root, "velnora.config"));
  const parsedConfig = await velnoraConfigSchema.parseAsync(config);
  return mergeConfig(options, parsedConfig);
};
