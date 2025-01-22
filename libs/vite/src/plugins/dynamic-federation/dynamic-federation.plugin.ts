import type { PluginOption } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";

import { moduleExposerPlugin } from "./module-exposer.plugin";

export const dynamicFederationPlugin = (config: FluxoraApp): PluginOption => {
  if (!config.remoteEntry.entryPath.endsWith(".js")) {
    throw new Error(`Remote entry path must end with .js, got ${config.remoteEntry.entryPath}`);
  }

  return [moduleExposerPlugin(config)];
};
