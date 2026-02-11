import { readFile } from "node:fs/promises";
import { join } from "node:path";

import destr from "destr";
import fg from "fast-glob";
import type { PackageJson } from "type-fest";

import type { Project } from "@velnora/types";

import { parseProjectEntry } from "./parse-project-entry";

/**
 * Finds all projects within a workspace root.
 *
 * This function uses the `workspaces` field in the root `package.json` to identify
 * potential project locations. It then searches for `package.json` files within
 * those locations, respecting exclusion patterns defined in `.gitignore`.
 * Default exclusions (node_modules, dist, build, .git) are added if not present.
 *
 * @param workspaceRoot - The absolute path to the workspace root directory.
 * @returns A promise that resolves to an array of detected Project objects.
 */
export const findProjects = async (workspaceRoot: string) => {
  const pkgPath = join(workspaceRoot, "package.json");
  const pkgContent = await readFile(pkgPath, "utf-8").catch(() => "{}");
  const pkg = destr<PackageJson>(pkgContent);
  const workspaces = pkg?.workspaces;

  const patterns = (Array.isArray(workspaces) ? workspaces : workspaces?.packages || []).map(
    ws => `${ws}/package.json`
  );

  if (patterns.length === 0) {
    return [];
  }

  const gitIgnorePath = join(workspaceRoot, ".gitignore");
  const gitIgnoreContent = await readFile(gitIgnorePath, "utf-8").catch(() => "");
  const gitIgnoreLines = gitIgnoreContent
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));

  const defaultIgnores = ["node_modules", "dist", "build", ".git"];
  const finalIgnores = [...gitIgnoreLines];

  for (const ignore of defaultIgnores) {
    const hasIgnore = gitIgnoreLines.some(line => line.includes(ignore));
    if (!hasIgnore) {
      finalIgnores.push(`**/${ignore}/**`);
    }
  }

  const entries = await fg(patterns, {
    cwd: workspaceRoot,
    ignore: finalIgnores,
    absolute: true
  });

  const projectsMap = new Map<string, Project>();

  const packageConfigResults = await Promise.all(entries.map(entry => parseProjectEntry(entry)));

  for (const result of packageConfigResults) {
    if (result) {
      projectsMap.set(result.root, result);
    }
  }

  return Array.from(projectsMap.values());
};
