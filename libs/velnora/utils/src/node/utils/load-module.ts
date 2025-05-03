import { access } from "node:fs/promises";
import { resolve } from "node:path";

import { serverEnv } from "./internal-vite-instance";

export const loadModule = async <T = Record<string, unknown>>(filePath: string) => {
  const resolvedPath = resolve(filePath);

  try {
    await access(resolvedPath);
  } catch {
    throw new Error(`Module not found at ${resolvedPath}`);
  }

  const module = await serverEnv.runner.import(resolvedPath);
  return module as T;
};
