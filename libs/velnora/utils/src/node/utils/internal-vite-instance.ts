import { createServer, isRunnableDevEnvironment } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { PROJECT_CWD } from "../const";

export const internalViteInstance = await createServer({
  root: PROJECT_CWD,
  plugins: [tsconfigPaths({ root: PROJECT_CWD, loose: true })],
  resolve: { preserveSymlinks: false },
  server: { ws: false, hmr: false, middlewareMode: true },
  appType: "custom",
  logLevel: "silent"
});
const ssrEnv = internalViteInstance.environments.ssr;
if (!isRunnableDevEnvironment(ssrEnv)) throw new Error("SSR environment is not runnable");
export const serverEnv = ssrEnv;

process.on("beforeExit", async () => {
  await internalViteInstance.close();
  await serverEnv.close();
});
