import { createServer, isRunnableDevEnvironment } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { findTsconfigProject } from "./find-tsconfig-project";

const projects: string[] = [];
let project: string;
if ((project = findTsconfigProject())) {
  projects.push(project);
}

export const vite = await createServer({
  plugins: [tsconfigPaths({ projects })],
  server: { middlewareMode: true, hmr: false, ws: false },
  configFile: false,
  appType: "custom",
  future: { removeSsrLoadModule: "warn" }
});

const maybeDevEnv = vite.environments.ssr;
if (!isRunnableDevEnvironment(maybeDevEnv)) {
  throw new Error("Vite SSR environment is not runnable.");
}
export const devRunner = maybeDevEnv.runner;
