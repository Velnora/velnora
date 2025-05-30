import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { AppType, type RegisteredModuleBase } from "@velnora/types";

import { appCtx } from "../app-ctx";

export const discoverLibs = async (): Promise<RegisteredModuleBase[]> => {
  const libs = await readdir(appCtx.projectStructure.libs.root);
  return libs.map(lib => ({
    type: AppType.LIBRARY,
    name: lib,
    root: resolve(appCtx.projectStructure.libs.root, lib),
    config: {}
  }));
};
