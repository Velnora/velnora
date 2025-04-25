import { appCtx } from "@fluxora/runtime";
import type { CreateServerOptions } from "@fluxora/types";

import { perModule } from "../utils/per-module";
import { startAppDevServer } from "./start-app-dev-server";

export const createDevServer = async (_options?: CreateServerOptions) => {
  // await import("@fluxora/daemon");

  await appCtx.resolveConfig();
  appCtx.checks();
  await appCtx.discoverModules();

  await perModule(appCtx.projectStructure.apps, startAppDevServer);
};
