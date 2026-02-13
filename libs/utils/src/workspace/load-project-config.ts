import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

import destr from "destr";
import { createJiti } from "jiti";

import type { VelnoraAppConfig } from "@velnora/types";

import { VELNORA_CONFIG_FILES } from "../constants";

/**
 * Locates and evaluates a `velnora.config.*` file in the given directory.
 *
 * Iterates through the known config filenames (`velnora.config.ts`, `.js`, `.json`)
 * and returns the first one found. TypeScript and JavaScript files are evaluated
 * at runtime via `jiti`; JSON files are parsed with `destr`.
 *
 * @param projectRoot - Absolute path to the project directory.
 * @returns The resolved configuration object, or `{}` if no config file exists.
 */
export const loadProjectConfig = async (projectRoot: string): Promise<VelnoraAppConfig> => {
  const jiti = createJiti(projectRoot);

  for (const filename of VELNORA_CONFIG_FILES) {
    const configPath = join(projectRoot, filename);

    try {
      await access(configPath);

      if (filename.endsWith(".json")) {
        const raw = await readFile(configPath, "utf-8");
        return destr<VelnoraAppConfig>(raw);
      }

      return await jiti.import<VelnoraAppConfig>(configPath, { default: true });
    } catch {
      // file does not exist — try next candidate
    }
  }

  return {} as VelnoraAppConfig;
};
