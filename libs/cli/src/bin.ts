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
  await runner.executeFile(path);
}
