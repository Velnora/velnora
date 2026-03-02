/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any */
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { createServer } from "vite";
import { ViteNodeRunner } from "vite-node/client";
import { ViteNodeServer } from "vite-node/server";
import tsconfigPaths from "vite-tsconfig-paths";

declare const NODE_ENV: string;

const root = process.env.PROJECT_CWD || process.cwd();

if (NODE_ENV === "production") {
  const path = resolve(import.meta.dirname, "./velnora.cli.js");
  await import(path);
} else {
  const path = resolve(import.meta.dirname, "../src/main.ts");

  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(`Cannot resolve "${path}"`);
  }

  const vite = await createServer({
    root,
    appType: "custom",
    logLevel: "error",
    plugins: [tsconfigPaths()],
    server: { hmr: false },
    resolve: { preserveSymlinks: true },
    build: { sourcemap: true },
    optimizeDeps: { entries: [] },
    ssr: { target: "node", noExternal: [/^@velnora\//] }
  });
  const vns = new ViteNodeServer(vite, { transformMode: { ssr: [/\.([cm]?ts|[jt]sx?)$/] } });
  const runner = new ViteNodeRunner({
    root,
    fetchModule: id => vns.fetchModule(id),
    resolveId: (id, importer) => vns.resolveId(id, importer)
  });

  const previousHandles: any[] = (process as any)._getActiveHandles?.() ?? [];
  const previousRequests: any[] = (process as any)._getActiveRequests?.() ?? [];

  await runner.executeFile(path);
  await new Promise<void>(r => setImmediate(r));

  const handles: any[] = (process as any)._getActiveHandles?.() ?? [];
  const requests: any[] = (process as any)._getActiveRequests?.() ?? [];

  if (handles.length > previousHandles.length || requests.length > previousRequests.length) {
    let closing = false;
    const closeViteOnce = async () => {
      if (closing) return;
      closing = true;
      await vite.close();
    };

    process.once("beforeExit", () => {
      void closeViteOnce();
    });
    process.once("SIGINT", () => {
      void closeViteOnce().finally(() => process.exit(130));
    });
    process.once("SIGTERM", () => {
      void closeViteOnce().finally(() => process.exit(143));
    });
  } else {
    await vite.close();
  }
}
