import express from "express";
import { isRunnableDevEnvironment } from "vite";

import type { WorkerMessage } from "@fluxora/types/worker";
import { ErrorMessages, PACKAGE_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";
import type { INestApplication } from "@nestjs/common";

import { logger } from "../../utils/logger";
import { checkViteServer, getAppConfig } from "./create-vite-server";

let app: express.Application;

export const serve = () =>
  new Promise<WorkerMessage>(async resolve => {
    const vite = checkViteServer();
    const appConfig = getAppConfig();

    const serverEnv = vite.environments[VITE_ENVIRONMENTS.SERVER];

    let module: { main: () => Promise<INestApplication> };
    if (isRunnableDevEnvironment(serverEnv)) {
      module = await serverEnv.runner.import(PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY);
    } else {
      throw new Error("Server environment is not runnable");
    }

    const nestApp = await module.main();
    const nestMiddleware = nestApp.getHttpAdapter().getInstance();

    app = express()
      .use(vite.middlewares)
      .use((req, res, next) => {
        if (req.url?.startsWith(`/api/v1/${appConfig.app.name}`)) return nestMiddleware(req, res);
        next();
      })
      .use("*", async (req, res) => {
        const html = await vite.transformIndexHtml(req.url, "");
        res.status(200).end(html);
      });

    app.listen(vite.config.server!.port, () => {
      logger.debug(`App (${appConfig.app.name}) is running at http://localhost:${vite.config.server?.port}`);
      resolve({ port: vite.config.server!.port! });
    });
  });

export const checkApp = () => {
  if (!app) {
    throw new Error(ErrorMessages.WORKER_APP_NOT_INITIALIZED);
  }

  return app;
};
