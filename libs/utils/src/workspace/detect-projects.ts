/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { readFile } from "node:fs/promises";

import fg from "fast-glob";
import type { PackageJson } from "type-fest";

import type { Project } from "@velnora/types";

import { parseProjectEntry } from "./parse-project-entry";

/**
 * Finds all projects within the current workspace.
 *
 * Uses the `workspaces` field in the root `package.json` to identify
 * potential project locations. Searches for `package.json` files within
 * those locations, respecting exclusion patterns defined in `.gitignore`.
 * Default exclusions (node_modules, dist, build, .git) are added if not present.
 *
 * Assumes `process.cwd()` is the workspace root (set by `Kernel.init()`).
 *
 * @param rootPkgJson - The parsed root `package.json`.
 * @returns A promise that resolves to an array of detected Project objects.
 */
export const detectProjects = async (rootPkgJson: PackageJson) => {
  const workspaces = rootPkgJson?.workspaces;

  const patterns = (Array.isArray(workspaces) ? workspaces : workspaces?.packages || []).map(
    ws => `${ws}/package.json`
  );

  if (patterns.length === 0) {
    return [];
  }

  const gitIgnoreContent = await readFile(".gitignore", "utf-8").catch(() => "");
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
