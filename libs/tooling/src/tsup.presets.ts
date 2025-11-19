import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type Options, defineConfig } from "tsup";
import type { PackageJson } from "type-fest";

/** Base options shared by web/node presets */
interface BaseOpts {
  /** Explicit outputName -> entryPath map (without .js extension) */
  entries: Record<string, string>;
  /** Extra externals (in addition to ALL deps: dep/dev/optional/peer) */
  external?: string[];
  /** Emit d.ts (default: true) */
  dts?: boolean;
  /** Sourcemaps (default: true) */
  sourcemap?: boolean;
  /** Minify (default: false) */
  minify?: boolean;
  /** Output directory (default: "build") */
  outDir?: string;
  /** Escape hatch to extend final tsup Options */
  extend?: Partial<Options>;
}

interface WebOpts extends BaseOpts {
  /** esbuild target (default: "es2024") */
  target?: string;
}

interface NodeOpts extends BaseOpts {
  /** esbuild target (default: "es2024") */
  target?: string;
  /** Force CLI shebang even without "bin" (default: false) */
  bannerBin?: boolean;
}

/** @velnora/foo or velnora/foo -> velnora.foo */
export const pkgNameToBase = (name: string): string => name.replace(/^@?velnora\//, "velnora.").replace(/\//g, ".");

const readPkg = (): PackageJson => {
  const json = readFileSync(join(process.cwd(), "package.json"), "utf-8");
  return JSON.parse(json) as PackageJson;
};

const makeBaseConfig = (o: BaseOpts): Omit<Options, "entry"> => {
  const pkg = readPkg();
  const externals = new Set([
    ...(o.external ?? []),
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {})
  ]);

  return {
    outDir: o.outDir ?? "build",
    format: ["esm"],
    target: "es2024",
    dts: o.dts ?? true,
    sourcemap: o.sourcemap ?? true,
    clean: true,
    splitting: false,
    treeshake: true,
    external: Array.from(externals),
    minify: o.minify ?? false,

    esbuildOptions(options) {
      options.supported = {
        "const-and-let": true,
        "arrow": true,
        "async-await": true,
        "class": true,
        "destructuring": true,
        "for-of": true,
        "object-rest-spread": true,
        "nullish-coalescing": true,
        "template-literal": true
      };
    }
  };
};

/** Web / isomorphic preset (integrations, runtime-client, vite-plugin browser bits) */
export const defineWebConfig = (opts: WebOpts) =>
  defineConfig({
    entry: opts.entries,
    ...makeBaseConfig(opts),
    target: opts.target ?? "es2024",
    ...(opts.extend ?? {})
  });

/** Node preset (runtime-server, CLI, Node-only libs) */
export const defineNodeConfig = (opts: NodeOpts) => {
  const base = makeBaseConfig(opts);
  const pkg = readPkg();
  const hasBin =
    opts.bannerBin === true ||
    typeof pkg.bin === "string" ||
    (pkg.bin && typeof pkg.bin === "object" && Object.keys(pkg.bin).length > 0);

  return defineConfig({
    entry: opts.entries,
    ...base,
    target: opts.target ?? "es2024",
    platform: "node",
    banner: hasBin ? { js: "#!/usr/bin/env node" } : undefined,
    ...(opts.extend ?? {})
  });
};
