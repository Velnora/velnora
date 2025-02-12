import { type ViteDevServer } from "vite";

import { appManager } from "@fluxora/common";
import { contentGenerator } from "@fluxora/generator";
import type { Package } from "@fluxora/types/core";
import { ErrorMessages } from "@fluxora/utils";
import { initialLoadExposedModules } from "@fluxora/utils/node";
import { createServer } from "@fluxora/vite";

import { logger } from "../../utils/logger";

export let __VITE_DEV_SERVER_INSTANCE__: ViteDevServer;
export let __APP_PKG__: Package;

export const createViteServer = async (pkg: Package) => {
  if (__VITE_DEV_SERVER_INSTANCE__) return;
  logger.debug(`Creating Vite server for ${pkg.name}`);
  const app = appManager.getAppOrThrow(pkg.name);

  await initialLoadExposedModules(app, app.config.exposedModules);
  __VITE_DEV_SERVER_INSTANCE__ = await createServer(app);
  __APP_PKG__ = app;
  await contentGenerator.app(app);
};

export const getViteServerInstance = () => {
  if (!__VITE_DEV_SERVER_INSTANCE__) {
    throw new Error(ErrorMessages.WORKER_VITE_NOT_INITIALIZED);
  }

  return __VITE_DEV_SERVER_INSTANCE__;
};

export const getAppPackage = () => {
  if (!__APP_PKG__) {
    throw new Error(ErrorMessages.WORKER_VITE_NOT_INITIALIZED);
  }

  return __APP_PKG__;
};
