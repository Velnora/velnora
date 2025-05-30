import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { basename } from "node:path";

import { glob } from "glob";

import { AppType, type RegisteredModuleBase } from "@velnora/types";

import { appCtx } from "../app-ctx";

export const discoverTemplates = async (): Promise<RegisteredModuleBase[]> => {
  const templatePossibleRoot = appCtx.projectStructure.template.root;
  const templatePkgJson = glob.sync(`package.json`, { cwd: templatePossibleRoot, absolute: true });
  if (templatePkgJson.length) {
    return [{ type: AppType.TEMPLATE, name: basename(templatePossibleRoot), root: templatePossibleRoot, config: {} }];
  }

  const templates = await readdir(appCtx.projectStructure.template.root);
  return templates.map(template => ({
    type: AppType.TEMPLATE,
    name: template,
    root: resolve(appCtx.projectStructure.template.root, template),
    config: {}
  }));
};
