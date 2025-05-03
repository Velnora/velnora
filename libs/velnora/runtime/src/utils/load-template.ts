import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { glob } from "glob";

export const loadTemplate = (path: string) => {
  const templatePkgJson = resolve(path, "package.json");
  if (existsSync(templatePkgJson)) return [path];
  return glob.sync(`${path}/*/package.json`, { absolute: true }).map(dirname);
};
