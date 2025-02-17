import type { PluginOption } from "vite";

import type { App } from "@fluxora/types/core";

import { localEntryDevPlugin } from "./local-entry.dev.plugin";
import { localEntryPlugin } from "./local-entry.plugin";
import { moduleExposerPlugin } from "./module-exposer.plugin";
import { remoteEntryPlugin } from "./remote-entry.plugin";
import { remotesPlugin } from "./remotes.plugin";

export const dynamicFederationPlugin = (app: App): PluginOption => {
  if (!app.remoteEntry.entryPath.endsWith(".js")) {
    throw new Error(`Remote entry path must end with .js, got ${app.remoteEntry.entryPath}`);
  }

  return [
    remotesPlugin(app)
    /*moduleExposerPlugin(app), [localEntryDevPlugin(), localEntryPlugin(app)], remoteEntryPlugin(app)*/
  ];
};
