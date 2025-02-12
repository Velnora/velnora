import { build as viteBuild } from "vite";

import type { Package } from "@fluxora/types/core";

import { getConfiguration } from "../config";

export const build = async (pkg: Package) => {
  return viteBuild(await getConfiguration(pkg));
};
