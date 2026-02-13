import { readFile } from "node:fs/promises";
import { dirname, relative } from "node:path";

import destr from "destr";
import type { PackageJson } from "type-fest";

import type { Project } from "@velnora/types";

import { loadProjectConfig } from "./load-project-config";

/**
 * Parses a single `package.json` entry into a {@link Project} object.
 *
 * Reads the `package.json` at the given path, derives both a stable
 * path-based `name` and a human-readable `displayName`, and attempts
 * to locate a `velnora.config.*` file for project-level configuration.
 *
 * @param entry         - Absolute path to the project's `package.json`.
 * @param workspaceRoot - Absolute path to the workspace root directory.
 *                        Used to compute the relative `name` identifier.
 * @returns The parsed {@link Project}, or `null` if the file cannot be read
 *          or does not contain a valid `name` field.
 */
export const parseProjectEntry = async (entry: string, workspaceRoot: string) => {
  try {
    const dir = dirname(entry);
    const raw = await readFile(entry, "utf-8");
    const packageJson = destr<PackageJson>(raw);

    if (!packageJson.name) {
      console.warn(`[Velnora] Skipping project at ${entry}: missing "name" in package.json`);
      return null;
    }

    const config = await loadProjectConfig(dir);

    return {
      name: relative(workspaceRoot, dir),
      displayName: packageJson.name,
      root: dir,
      packageJson,
      config
    } satisfies Project;
  } catch (error) {
    console.warn(`[Velnora] Failed to load project at ${entry}:`, error);
    return null;
  }
};
