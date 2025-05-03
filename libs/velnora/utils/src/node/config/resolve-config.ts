import type { WithDefault } from "@velnora/types";

import { loadModule } from "../utils";

export const resolveConfig = async <TConfig extends object>(configFile: string) => {
  const module = await loadModule<WithDefault<TConfig | undefined>>(configFile);
  const config = module.default;
  if (!config) return;
  if (typeof config !== "object") throw new Error(`Invalid config file: ${configFile}`);
  return config;
};
