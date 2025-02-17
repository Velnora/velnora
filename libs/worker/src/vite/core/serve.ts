import express from "express";
import { isRunnableDevEnvironment } from "vite";

import { AppType } from "@fluxora/types/core";
import type { WorkerMessage } from "@fluxora/types/worker";
import { ErrorMessages, PACKAGE_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";
import type { INestApplication } from "@nestjs/common";

import { logger } from "../../utils/logger";
import { getAppPackage, getViteServerInstance } from "./create-vite-server";

export let __APP__: express.Application;

export const serve = async () => {
  const vite = getViteServerInstance();
  const app = getAppPackage();

  const clientEnv = vite.environments[VITE_ENVIRONMENTS.CLIENT];
  const serverEnv = vite.environments[VITE_ENVIRONMENTS.SERVER];

  let module: { main: () => Promise<INestApplication> };
  if (isRunnableDevEnvironment(serverEnv)) {
    module = await serverEnv.runner.import(PACKAGE_ENTRIES.SERVER_ENTRY);
  } else {
    throw new Error(ErrorMessages.SERVER_ENV_NOT_RUNNABLE);
  }

  const nestApp = await module.main();
  const nestMiddleware = nestApp.getHttpAdapter().getInstance();

  __APP__ = express()
    .use(vite.middlewares)
    .all(`/api/v1/${app.name}*`, (req, res) => {
      nestMiddleware(req, res);
    });

  if (app.type === AppType.APPLICATION) {
    __APP__.get(app.remoteEntry.entryPath, async (req, res) => {
      const js = await clientEnv.transformRequest(req.url);
      res.status(200).setHeader("Content-Type", "application/javascript").end(js);
    });
  }

  __APP__.use("*", async (req, res) => {
    const html = await vite.transformIndexHtml(req.url, "");
    res.status(200).end(html);
  });

  const { promise, resolve } = Promise.withResolvers<WorkerMessage>();
  __APP__.listen(vite.config.server!.port, () => {
    logger.debug(`App (${app.name}) is running at http://localhost:${vite.config.server?.port}`);
    resolve({ port: vite.config.server!.port! });
  });

  return await promise;
};

export const checkApp = () => {
  if (!__APP__) {
    throw new Error(ErrorMessages.WORKER_APP_NOT_INITIALIZED);
  }

  return __APP__;
};
