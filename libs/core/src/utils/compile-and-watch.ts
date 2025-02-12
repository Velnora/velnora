import { type Package } from "@fluxora/types/core";
import { build } from "@fluxora/vite";

export const compileAndWatch = async (pkg: Package) => {
  const output = await build(pkg);
  return Array.isArray(output) ? output[0].output[0].fileName : null;
};
