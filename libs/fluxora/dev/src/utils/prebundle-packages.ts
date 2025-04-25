import { build } from "esbuild";

export const prebundlePackages = async (packages: string[]) => {
  await build({
    entryPoints: packages,
    bundle: true,
    format: "esm",
    outdir: ".fluxora/vite",
    splitting: true,
    write: true,
    metafile: true,
    sourcemap: true
  });
};
