/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { readFile } from "node:fs/promises";
import { dirname, relative } from "node:path";

import destr from "destr";
import type { PackageJson } from "type-fest";

import type { VelnoraAppConfig } from "@velnora/types";

import { Project } from "../project";
import { parseConfig } from "./parse-config";

/**
 * Parses a single `package.json` entry into a {@link Project} instance.
 *
 * Reads the `package.json` at the given path, derives both a stable
 * path-based `name` (relative to `process.cwd()`) and a human-readable
 * `displayName`, and attempts to locate a `velnora.config.*` file for
 * project-level configuration.
 *
 * Assumes `process.cwd()` is the workspace root (set by `Kernel.init()`).
 *
 * @param entry - Absolute path to the project's `package.json`.
 * @returns The parsed {@link Project}, or `null` if the file cannot be read
 *          or does not contain a valid `name` field.
 */
export const parseProjectEntry = async (entry: string) => {
  try {
    const dir = dirname(entry);
    const raw = await readFile(entry, "utf-8");
    const packageJson = destr<PackageJson>(raw);

    if (!packageJson.name) {
      console.warn(`[Velnora] Skipping project at ${entry}: missing "name" in package.json`);
      return null;
    }

    const config = await parseConfig<VelnoraAppConfig>(dir);

    return new Project({ name: relative(process.cwd(), dir), root: dir, packageJson, config });
  } catch (error) {
    console.warn(`[Velnora] Failed to load project at ${entry}:`, error);
  }

  return null;
};
