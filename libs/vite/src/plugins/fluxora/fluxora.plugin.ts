import type { PluginOption } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";

import { entryAppHtml } from "./entry-app-html";
import { fluxoraAppConfigPlugin } from "./fluxora-app-config.plugin";
import { fluxoraClientEntryDevPlugin } from "./fluxora-client-entry-dev.plugin";
import { fluxoraClientEntryPlugin } from "./fluxora-client-entry.plugin";
import { fluxoraFsPlugin } from "./fluxora-fs.plugin";
import { fluxoraServerEntryDevPlugin } from "./fluxora-server-entry-dev.plugin";
import { fluxoraServerEntryPlugin } from "./fluxora-server-entry.plugin";

export const fluxoraPlugin = (config: FluxoraApp): PluginOption => {
  return [
    entryAppHtml(config),
    fluxoraFsPlugin(),
    fluxoraAppConfigPlugin(config),
    [fluxoraClientEntryDevPlugin(config), fluxoraClientEntryPlugin(config)],
    [fluxoraServerEntryDevPlugin(config), fluxoraServerEntryPlugin(config)]
  ];
};
