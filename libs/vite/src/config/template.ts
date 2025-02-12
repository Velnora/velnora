import { resolve } from "node:path";

import type { InlineConfig } from "vite";

import type { Package } from "@fluxora/types/core";
import { createViteLogger } from "@fluxora/utils";

import { logger } from "../utils/logger";

export const getTemplateConfiguration = async (pkg: Package) => {
  return {
    root: pkg.root,
    clearScreen: false,
    build: {
      ssr: true,
      lib: { entry: { template: resolve(pkg.root, "src/main.tsx") }, formats: ["es"] },
      outDir: resolve(pkg.root, "build"),
      watch: { clearScreen: false }
    },
    customLogger: createViteLogger(logger)
  } satisfies InlineConfig;
};
