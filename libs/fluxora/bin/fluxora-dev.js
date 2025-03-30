#!/usr/bin/env node
import { resolve } from "node:path";

import { createServer } from "vite";
import { ViteNodeRunner } from "vite-node/client";
import { ViteNodeServer } from "vite-node/server";
import tsconfigPaths from "vite-tsconfig-paths";

const PROJECT_CWD = process.env.PROJECT_CWD || process.cwd();

const fluxoraDevResolver = {
  name: "fluxora-dev-resolver",

  resolveId(id) {
    if (id === "../build/fluxora.cli.js") {
      return resolve(PROJECT_CWD, "libs/fluxora/src/cli.ts");
    }
  }
};

const viteServer = await createServer({
  define: { __DEV__: true },
  plugins: [tsconfigPaths({ root: PROJECT_CWD }), fluxoraDevResolver],
  server: { middlewareMode: true },
  clearScreen: false
});

const nodeServer = new ViteNodeServer(viteServer);

const runner = new ViteNodeRunner({
  fetchModule: id => nodeServer.fetchModule(id),
  resolveId: (id, importer) => nodeServer.resolveId(id, importer)
});

const activeHandlesLength = process._getActiveHandles().length;
await runner.executeFile(resolve(PROJECT_CWD, "libs/fluxora/bin/fluxora.js"));

const waitForIdleLoop = () => {
  if (process._getActiveHandles().length === activeHandlesLength && process._getActiveRequests().length === 0) {
    viteServer.close().then(() => {
      process.exit(0);
    });
  } else {
    setTimeout(waitForIdleLoop, 100);
  }
};
waitForIdleLoop();
