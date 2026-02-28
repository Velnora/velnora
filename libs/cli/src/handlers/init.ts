/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { dirname } from "node:path";

import { initWorkspace } from "@velnora/generator";

/**
 * Action handler for the `velnora init` command.
 *
 * Delegates to {@link initWorkspace} and logs the outcome to the console.
 *
 * @param cwd - The target directory to initialize as a Velnora workspace.
 */
export const handleInit = (cwd: string) => {
  const result = initWorkspace(cwd);
  const status = result.status === "created" ? "Initialized workspace" : "Already initialized";
  console.info(`[Velnora] ${status}: ${dirname(result.configPath)}`);
};
