import { createServer as createViteServer } from "vite";

import type { Package } from "@fluxora/types/core";

import { getConfiguration } from "../config";
import { logger } from "../utils/logger";

export const createServer = async (pkg: Package) => {
  const config = await getConfiguration(pkg);
  logger.debug(`Configuring vite for ${pkg.name}`, config);
  return createViteServer(config);
};
