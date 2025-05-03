import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { AppType, type RegisteredModuleBase } from "@velnora/types";

import { appCtx } from "../app-ctx";

export const discoverApps = async (): Promise<RegisteredModuleBase[]> => {
  const apps = await readdir(appCtx.projectStructure.apps.root);
  return apps.map(app => ({
    type: AppType.APPLICATION,
    name: app,
    root: resolve(appCtx.projectStructure.apps.root, app),
    config: {}
  }));
};
