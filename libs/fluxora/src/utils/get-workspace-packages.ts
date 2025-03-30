import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { glob } from "glob";
import { PackageJson } from "type-fest";

export const getWorkspacePackages = (root: string): string[] => {
  const packageJSONFile = readFileSync(resolve(root, "package.json"), "utf-8");
  const { workspaces } = JSON.parse(packageJSONFile) as PackageJson;
  return !workspaces
    ? []
    : ((Array.isArray(workspaces) ? workspaces : workspaces?.packages) || [])
        .flatMap(pkg => glob.sync(resolve(root, pkg), { absolute: true, posix: true }))
        .flatMap(pkg => [pkg, ...getWorkspacePackages(pkg)]);
};
