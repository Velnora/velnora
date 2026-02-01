import { readFileSync } from "node:fs";
import { dirname } from "node:path";

import destr from "destr";
import { findUp } from "find-up";

import { VELNORA_CONFIG_FILES } from "../constants";

export { VELNORA_CONFIG_FILES };

export async function findWorkspaceRoot(cwd: string): Promise<string | undefined> {
  // 1. Look for velnora.config.* files
  const configPath = await findUp(VELNORA_CONFIG_FILES, { cwd });

  if (configPath) {
    return dirname(configPath);
  }

  // 2. Look for package.json with "velnora" property
  const packageJsonPath = await findUp("package.json", { cwd });

  if (packageJsonPath) {
    try {
      const pkgContent = readFileSync(packageJsonPath, "utf-8");
      // Use destr for safe parsing
      const pkg = destr(pkgContent);

      if (pkg && typeof pkg === "object" && "velnora" in pkg) {
        return dirname(packageJsonPath);
      }
    } catch {
      // Ignore errors
    }
  }

  // 3. Fallback
  return cwd;
}
