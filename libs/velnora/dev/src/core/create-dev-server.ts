import { appCtx, entityManager } from "@velnora/runtime";
import type { CreateServerOptions } from "@velnora/types";

import { initVelnoraContext } from "../utils/init-velnora-context";
import { logger } from "../utils/logger";

export const createDevServer = async (_options?: CreateServerOptions) => {
  // await import("@velnora/daemon");

  initVelnoraContext();

  logger.info("Velnora", "", "Starting Velnora Dev Server...");

  await appCtx.resolveConfig();
  appCtx.checks();
  await appCtx.discoverModules();

  const entity = entityManager.init(appCtx.projectStructure.apps.getHostApp());
  await entity.start();
};
