import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { RegisteredModuleBase } from "@fluxora/types";
import { CONFIG_FILENAMES, resolveConfig } from "@fluxora/utils/node";

import { appCtx } from "../app-ctx";

export const loadModules = async (discoveredModules: RegisteredModuleBase[]) => {
  const discoverModulePromises = discoveredModules.map(async module => {
    const configFile = CONFIG_FILENAMES.map(file => resolve(module.root, file)).find(file => existsSync(file));
    const config = configFile ? (await resolveConfig(configFile)) || {} : {};
    appCtx.projectStructure.register({ ...module, config });
  });
  await Array.fromAsync(discoverModulePromises).catch(console.error);
};
