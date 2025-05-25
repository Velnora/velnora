import { appCtx, entityManager } from "@velnora/runtime";
import type { CreateServerOptions } from "@velnora/types";

import { initVelnoraContext } from "../utils/init-velnora-context";

export const createDevServer = async (_options?: CreateServerOptions) => {
  // await import("@velnora/daemon");

  initVelnoraContext();

  await appCtx.resolveConfig();
  appCtx.checks();
  await appCtx.discoverModules();

  const entity = entityManager.init(appCtx.projectStructure.apps.getHostApp());
  await entity.start();
  // await entity.prepare();
  // await entity.start();
};
