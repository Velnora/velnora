import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const CONFIG_FILE_NAME = "velnora.config.ts";
const PACKAGE_JSON_FILE_NAME = "package.json";

const CONFIG_TEMPLATE = `import { defineConfig } from "velnora";

export default defineConfig({
  // workspace config
});
`;

export interface InitWorkspaceResult {
  configPath: string;
  packageJsonPath: string;
  status: "created" | "exists";
}

export const initWorkspace = (cwd: string): InitWorkspaceResult => {
  const targetDir = resolve(cwd);
  mkdirSync(targetDir, { recursive: true });

  const configPath = resolve(targetDir, CONFIG_FILE_NAME);
  const packageJsonPath = resolve(targetDir, PACKAGE_JSON_FILE_NAME);

  const packageJsonTemplate = `${JSON.stringify(
    {
      name: basename(targetDir),
      private: true,
      type: "module",
      workspaces: []
    },
    null,
    2
  )}\n`;

  let created = false;

  if (!existsSync(configPath)) {
    writeFileSync(configPath, CONFIG_TEMPLATE, "utf8");
    created = true;
  }

  if (!existsSync(packageJsonPath)) {
    writeFileSync(packageJsonPath, packageJsonTemplate, "utf8");
    created = true;
  }

  return {
    configPath,
    packageJsonPath,
    status: created ? "created" : "exists"
  };
};
