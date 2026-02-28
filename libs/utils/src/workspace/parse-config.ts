/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { access, readFile } from "node:fs/promises";

import destr from "destr";
import { glob } from "fast-glob";

import { VELNORA_CONFIG_FILES } from "../constants";
import { jiti } from "../utils/jiti";

/**
 * Locates and evaluates a `velnora.config.*` file in the given directory.
 *
 * Iterates through the known config filenames (`velnora.config.ts`, `.js`, `.json`)
 * and returns the first one found. TypeScript and JavaScript files are evaluated
 * at runtime via `jiti`; JSON files are parsed with `destr`.
 *
 * @param root - Absolute path to the project directory.
 * @returns The resolved configuration object, or `{}` if no config file exists.
 */
export const parseConfig = async <TConfig>(root: string): Promise<TConfig> => {
  const [configPath, ...otherConfigs] = await glob(VELNORA_CONFIG_FILES, { cwd: root });
  if (otherConfigs.length > 1)
    throw new Error(
      `[Velnora] Multiple config files found: ${configPath}, ${otherConfigs.join(", ")}. Please ensure only one of the following exists: ${VELNORA_CONFIG_FILES.join(", ")}.`
    );

  if (!configPath) return {} as TConfig;

  try {
    await access(configPath);
  } catch (err) {
    console.error(`[Velnora] Error accessing config file at ${configPath}:`, err);
    return {} as TConfig;
  }

  if (configPath.endsWith(".json")) {
    const raw = await readFile(configPath, "utf-8");
    return destr<TConfig>(raw);
  }

  try {
    return await jiti.import<TConfig>(configPath, { default: true });
  } catch (e) {
    console.error(`[Velnora] Error loading config file at ${configPath}:`, e);
  }

  return {} as TConfig;
};
