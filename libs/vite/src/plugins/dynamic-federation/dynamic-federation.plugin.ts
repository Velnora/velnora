import type { PluginOption } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";

import { moduleExposerPlugin } from "./module-exposer.plugin";
import { remoteEntryPlugin } from "./remote-entry.plugin";

export const dynamicFederationPlugin = async (config: FluxoraApp): Promise<PluginOption> => {
  // if (!config.remoteEntry.entryPath.endsWith(".js")) {
  //   throw new Error(`Remote entry path must end with .js, got ${config.remoteEntry.entryPath}`);
  // }

  return [moduleExposerPlugin(config), await remoteEntryPlugin(config)];
};
