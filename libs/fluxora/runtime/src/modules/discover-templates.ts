import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { basename } from "node:path";

import { glob } from "glob";

import { AppType, type RegisteredModuleBase } from "@fluxora/types";

import { appCtx } from "../app-ctx";

export const discoverTemplates = async (): Promise<RegisteredModuleBase[]> => {
  const templatePossibleRoot = appCtx.projectStructure.template.dir;
  const templatePkgJson = glob.sync(`package.json`, { cwd: templatePossibleRoot, absolute: true });
  if (templatePkgJson.length) {
    return [{ type: AppType.TEMPLATE, name: basename(templatePossibleRoot), root: templatePossibleRoot, config: {} }];
  }

  const templates = await readdir(appCtx.projectStructure.template.dir);
  return templates.map(template => ({
    type: AppType.TEMPLATE,
    name: template,
    root: resolve(appCtx.projectStructure.template.dir, template),
    config: {}
  }));
};
