import { appCtx } from "@velnora/runtime";
import type { CreateServerOptions } from "@velnora/types";

import { perModule } from "../utils/per-module";
import { startAppDevServer } from "./start-app-dev-server";

export const createDevServer = async (_options?: CreateServerOptions) => {
  // await import("@velnora/daemon");

  await appCtx.resolveConfig();
  appCtx.checks();
  await appCtx.discoverModules();

  await perModule(appCtx.projectStructure.apps, startAppDevServer);
};
