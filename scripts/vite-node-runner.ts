import { existsSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { type InlineConfig, type Plugin, createServer as createViteDevServer } from "vite";
import { ViteNodeRunner } from "vite-node/client";
import { ViteNodeServer } from "vite-node/server";
import tsconfigPaths from "vite-tsconfig-paths";

const isDebug =
  process.env.VITE_DEBUG === "true" ||
  process.env.DEBUG?.includes("vite:resolve") ||
  process.env.DEBUG?.includes("vite:*") ||
  false;

const root = process.env.PROJECT_CWD || process.cwd();

// Allow extensionless relative/absolute specifiers only (never bare imports)
const tryResolveNoExt = (
  spec: string,
  importerDir: string,
  exts: string[] = [".ts", ".tsx", ".js", ".mjs", ".cjs", ".mts", ".cts"]
): string | null => {
  if (!spec.startsWith(".") && !isAbsolute(spec)) return null;
  const base = isAbsolute(spec) ? spec : resolve(importerDir, spec);

  for (const ext of exts) {
    const f = base + ext;
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const ext of exts) {
      const idx = join(base, "index" + ext);
      if (existsSync(idx) && statSync(idx).isFile()) return idx;
    }
  }
  return null;
};

const debugPlugin: Plugin = {
  name: "debug-resolve-cli-helper",
  enforce: "pre",

  resolveId: {
    order: "pre",
    handler(id, importer) {
      this.debug(`[resolver] ${id} <- ${importer} consumer=${this.environment.config.consumer}`);
    }
  }
};

export const run = async (entry: string) => {
  const viteConfig: InlineConfig = {
    root,
    plugins: [isDebug && debugPlugin, tsconfigPaths()],
    appType: "custom",
    logLevel: "error",
    server: { hmr: false },
    resolve: { preserveSymlinks: true },
    build: { sourcemap: true },
    optimizeDeps: { entries: [] },
    ssr: { target: "node", noExternal: [/^@velnora\//] }
  };

  const vite = await createViteDevServer(viteConfig);
  await vite.pluginContainer.buildStart({});
  try {
    // Only SSR transform mode; no 'web' pipeline at all
    const vns = new ViteNodeServer(vite, {
      transformMode: { ssr: [/\.([cm]?ts|[jt]sx?)$/] }
    });

    const runner = new ViteNodeRunner({
      root,
      fetchModule: id => vns.fetchModule(id),
      resolveId: async (id, importer) => {
        // 1) Let Vite/Node resolve first
        const resolved = await vns.resolveId(id, importer);
        if (resolved) return resolved;

        // 2) Extensionless fallback for relative/absolute specifiers
        const importerDir = importer
          ? dirname(importer.startsWith("file:") ? fileURLToPath(importer) : importer)
          : root;

        const guessed = tryResolveNoExt(id, importerDir);
        return guessed ? { id: pathToFileURL(guessed).toString() } : null;
      }
    });

    // Resolve the entry relative to project root; allow no extension
    const fakeImporter = pathToFileURL(resolve(root, ".__node_runner__.ts")).toString();

    let resolved = await vns.resolveId(entry, fakeImporter);
    if (!resolved?.id) {
      const guessed = tryResolveNoExt(entry, root);
      if (!guessed) throw new Error(`Cannot resolve "${entry}" from ${root}`);
      resolved = { id: pathToFileURL(guessed).toString() };
    }

    return await runner.executeFile(resolved.id);
  } finally {
    await vite.close();
  }
};
