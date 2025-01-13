import type { PluginOption } from "vite";

import type { FluxoraApp } from "../../../types";
import { entryAppHtml } from "./entry-app-html";
import { fluxoraClientEntryDevPlugin } from "./fluxora-client-entry-dev.plugin";
import { fluxoraClientEntryPlugin } from "./fluxora-client-entry.plugin";
import { fluxoraServerEntryDevPlugin } from "./fluxora-server-entry-dev.plugin";
import { fluxoraServerEntryPlugin } from "./fluxora-server-entry.plugin";

export const fluxoraPlugin = (config: FluxoraApp): PluginOption => {
  return [
    entryAppHtml(config),
    [fluxoraClientEntryDevPlugin(config), fluxoraClientEntryPlugin(config)],
    [fluxoraServerEntryDevPlugin(config), fluxoraServerEntryPlugin(config)]
  ];
};
