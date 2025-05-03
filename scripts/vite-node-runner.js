import { resolve } from "node:path";

import { createServer, isRunnableDevEnvironment } from "vite";

export const PROJECT_CWD = process.env.PROJECT_CWD || process.cwd();

const internalServer = await createServer({ server: { hmr: false }, logLevel: "silent" });
const internalSsrEnv = internalServer.environments.ssr;
if (!isRunnableDevEnvironment(internalSsrEnv)) throw new Error("SSR environment is not runnable");
const config = await internalSsrEnv.runner.import(resolve(PROJECT_CWD, "scripts/define-fluxora-config.ts"));

const inlineConfig = config.defineFluxoraConfig.dev({
  define: { __DEV__: true },
  resolve: { alias: { "../build/fluxora.cli.js": resolve(PROJECT_CWD, "libs/fluxora/cli/src/main.ts") } },
  server: { middlewareMode: true, hmr: false, ws: false },
  clearScreen: false,
  logLevel: "silent"
});

const viteServer = await createServer(inlineConfig);
const viteSsrEnv = viteServer.environments.ssr;
if (!isRunnableDevEnvironment(viteSsrEnv)) throw new Error("SSR environment is not runnable");
/** @type {import('vite').RunnableDevEnvironment} */
export const ssrEnv = viteSsrEnv;

export const runScript = async cb => {
  const activeHandlesLength = process._getActiveHandles().length;

  await cb();

  const waitForIdleLoop = () => {
    if (process._getActiveHandles().length === activeHandlesLength && process._getActiveRequests().length === 0) {
      Promise.all([internalServer.close(), viteServer.close()]).then(() => process.exit(0));
    } else {
      setTimeout(waitForIdleLoop, 100);
    }
  };
  waitForIdleLoop();
};
