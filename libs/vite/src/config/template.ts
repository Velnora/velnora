import { resolve } from "node:path";

import type { MicroApp } from "@fluxora/types/core";
import { createViteLogger } from "@fluxora/utils";

import { logger } from "../utils/logger";
import { getConfiguration } from "./configuration";

export const getTemplateConfiguration = async (app: MicroApp) => {
  return getConfiguration({
    root: app.root,
    clearScreen: false,
    build: {
      ssr: true,
      lib: { entry: { template: resolve(app.root, "src/main.tsx") }, formats: ["es"] },
      outDir: resolve(app.root, "build"),
      watch: { clearScreen: false }
    },
    customLogger: createViteLogger(logger)
  });
};
