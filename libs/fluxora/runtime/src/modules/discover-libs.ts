import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { AppType, type RegisteredModuleBase } from "@fluxora/types";

import { appCtx } from "../app-ctx";

export const discoverLibs = async (): Promise<RegisteredModuleBase[]> => {
  const libs = await readdir(appCtx.projectStructure.libs.dir);
  return libs.map(lib => ({
    type: AppType.LIBRARY,
    name: lib,
    root: resolve(appCtx.projectStructure.libs.dir, lib),
    config: {}
  }));
};
