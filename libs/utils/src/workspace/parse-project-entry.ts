import { readFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { Project, ProjectConfig } from "@velnora/types";

/**
 * Parses a project entry from a config file path.
 *
 * @param entry - The absolute path to the configuration file.
 * @returns The parsed Project object or null if parsing fails.
 */
export const parseProjectEntry = async (entry: string) => {
  try {
    const dir = dirname(entry);
    const content = await readFile(entry, "utf-8");
    const config = JSON.parse(content) as ProjectConfig;

    if (!config.name) {
      console.warn(`[Velnora] Skipping project at ${entry}: Missing 'name' in config file`);
      return null;
    }

    return {
      name: config.name,
      displayName: config.name.replace(/^@[^/]+\//, ""),
      root: dir,
      config,
      configFile: entry
    };
  } catch (error) {
    console.warn(`[Velnora] Failed to load project at ${entry}:`, error);
    return null;
  }
};
