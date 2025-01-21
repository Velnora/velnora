import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { FluxoraConfig } from "@fluxora/types/core";

export const checkAndGenerateGitignore = (config: FluxoraConfig) => {
  const cacheRoot = config.cacheRoot || resolve(process.cwd(), ".fluxora");
  const gitignoreFile = resolve(cacheRoot, ".gitignore");
  if (!existsSync(gitignoreFile)) {
    const gitignoreContent = ["*", ".*"].join("\n") + "\n";
    mkdirSync(cacheRoot, { recursive: true });
    writeFileSync(gitignoreFile, gitignoreContent);
  }
};
