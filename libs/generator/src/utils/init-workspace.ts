/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

/** Default file name for the Velnora workspace configuration. */
const CONFIG_FILE_NAME = "velnora.config.ts";

/** Default file name for the npm package manifest. */
const PACKAGE_JSON_FILE_NAME = "package.json";

/** Template content written to a new `velnora.config.ts` during workspace initialization. */
const CONFIG_TEMPLATE = `import { defineConfig } from "velnora";

export default defineConfig({
  // workspace config
});
`;

/** Describes the result of a workspace initialization attempt. */
export interface InitWorkspaceResult {
  /** Absolute path to the `velnora.config.ts` file. */
  configPath: string;
  /** Absolute path to the `package.json` file. */
  packageJsonPath: string;
  /** `"created"` if any file was written; `"exists"` if both already existed. */
  status: "created" | "exists";
}

/**
 * Initializes a Velnora workspace in the given directory.
 *
 * Creates `velnora.config.ts` and `package.json` if they do not already exist.
 * The target directory is created recursively when it does not exist.
 *
 * @param cwd - The directory in which to initialize the workspace.
 * @returns An {@link InitWorkspaceResult} describing what was created.
 */
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
