import type { PluginOption } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";

import { entryPlugin } from "./entry.plugin";
import { fluxoraEntryDevPlugin } from "./entry/fluxora-entry.dev.plugin";
import { fluxoraEntryPlugin } from "./entry/fluxora-entry.plugin";
import { fluxoraAppConfigPlugin } from "./fluxora-app-config.plugin";

export const fluxoraPlugin = (config: FluxoraApp): PluginOption => {
  return [
    entryPlugin(config),
    fluxoraAppConfigPlugin(config),
    [fluxoraEntryDevPlugin(config), fluxoraEntryPlugin(config)]
  ];
};
