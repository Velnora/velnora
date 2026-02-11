import { readFileSync } from "node:fs";
import { dirname } from "node:path";

import destr from "destr";
import { findUp } from "find-up";
import type { PackageJson } from "type-fest";

import { isAbsoluteRoot } from "../utils/is-absolute-root";

/**
 * Detects the workspace root directory by looking for a package.json with a "workspaces" property.
 *
 * @param cwd - The current working directory to start searching from.
 * @returns The absolute path to the workspace root.
 * @throws If no workspace root is found.
 */
export const findWorkspaceRoot = async (cwd: string) => {
  let dir = cwd;

  while (true) {
    const pkgPath = await findUp("package.json", { cwd: dir });

    if (!pkgPath) break;

    try {
      const pkgJson = destr<PackageJson>(readFileSync(pkgPath, "utf-8"));

      if (pkgJson?.workspaces) {
        return dirname(pkgPath);
      }
    } catch {
      // Ignore read errors and continue searching up
    }

    const parentDir = dirname(dirname(pkgPath));

    if (parentDir === dir || isAbsoluteRoot(dir)) {
      break;
    }

    dir = parentDir;
  }

  throw new Error(
    "[Velnora] No workspace root found. Ensure a 'package.json' with 'workspaces' exists in the hierarchy."
  );
};
