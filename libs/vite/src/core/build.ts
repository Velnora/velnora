import { type InlineConfig, build as viteBuild } from "vite";

import { getConfiguration } from "@fluxora/vite";

export const build = async (config: InlineConfig) => {
  return viteBuild(await getConfiguration(config));
};
