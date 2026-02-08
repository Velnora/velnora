import { readFileSync } from "node:fs";
import { dirname } from "node:path";

import destr from "destr";
import { findUp } from "find-up";
import type { PackageJson } from "type-fest";

import { VELNORA_CONFIG_FILES } from "../constants";

/**
 * Detects the workspace root directory.
 *
 * It traverses up from the current working directory (`cwd`) looking for:
 * 1. A `velnora.config.*` file.
 * 2. A `package.json` file containing a `velnora` property.
 *
 * @param cwd - The current working directory to start searching from.
 * @returns The absolute path to the workspace root, or `undefined` if not found (falls back to `cwd` in implementation but logical return helps).
 *          Actually implementation returns `dirname` or `cwd` fallback.
 */
export const findWorkspaceRoot = async (cwd: string) => {
  const configPath = await findUp(VELNORA_CONFIG_FILES, { cwd });

  if (configPath) {
    return dirname(configPath);
  }

  const packageJsonPath = await findUp("package.json", { cwd });

  if (packageJsonPath) {
    try {
      const pkgContent = readFileSync(packageJsonPath, "utf-8");
      const pkg = destr<PackageJson>(pkgContent);

      if (pkg && typeof pkg === "object" && "velnora" in pkg) {
        return dirname(packageJsonPath);
      }
    } catch {
      // empty
    }
  }

  return cwd;
};
