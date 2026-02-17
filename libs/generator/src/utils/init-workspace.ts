import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const CONFIG_FILE_NAME = "velnora.config.ts";

const CONFIG_TEMPLATE = `import { defineConfig } from "velnora";

export default defineConfig({
  // workspace config
});
`;

export interface InitWorkspaceResult {
  configPath: string;
  status: "created" | "exists";
}

export const initWorkspace = (cwd: string): InitWorkspaceResult => {
  const targetDir = resolve(cwd);
  mkdirSync(targetDir, { recursive: true });

  const configPath = join(targetDir, CONFIG_FILE_NAME);
  if (existsSync(configPath)) {
    return { configPath, status: "exists" };
  }

  writeFileSync(configPath, CONFIG_TEMPLATE, "utf8");
  return { configPath, status: "created" };
};
