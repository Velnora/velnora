import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

export const findTsconfigProject = (root = process.cwd()) => {
  let path = resolve(root);
  while (true) {
    if (existsSync(resolve(path, "tsconfig.json"))) return resolve(path, "tsconfig.json");
    if (
      path === "/" ||
      // for win32 compatibility
      path.match(/^[A-Z]:\\$/i)
    )
      break;
    path = dirname(path);
  }
  throw new Error(`Could not find a tsconfig.json file starting from ${root}`);
};
