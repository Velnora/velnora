import type { PluginOption } from "vite";

import type { App } from "@fluxora/types/core";

import { entryPlugin } from "./entry.plugin";
import { fluxoraEntryDevPlugin } from "./entry/fluxora-entry.dev.plugin";
import { fluxoraEntryPlugin } from "./entry/fluxora-entry.plugin";
import { fluxoraAppConfigPlugin } from "./fluxora-app-config.plugin";

export const fluxoraPlugin = (app: App): PluginOption => {
  return [entryPlugin(app), fluxoraAppConfigPlugin(app), [fluxoraEntryDevPlugin(), fluxoraEntryPlugin(app)]];
};
