import { parentPort, workerData } from "worker_threads";

import express from "express";
import { createServer, isRunnableDevEnvironment } from "vite";

import type { WorkerCreateServerData, WorkerMessage } from "@fluxora/types/worker";
import type { INestApplication } from "@nestjs/common";

import { PACKAGE_ENTRIES, VITE_ENVIRONMENTS } from "./const";
import { getAppConfiguration } from "./core/configuration/app";
import { FluxoraAppConfigBuilder } from "./utils/fluxora-app-config.builder";
import { logger } from "./utils/logger";

const data = workerData as WorkerCreateServerData;
const { app: microApp, config } = data;

const appConfigBuilder = await FluxoraAppConfigBuilder.from(microApp, config);
const appConfig = await appConfigBuilder.setRemoteEntry().retrieveViteConfigFile().build();
const viteConfig = await getAppConfiguration(appConfig);
const vite = await createServer(viteConfig);
vite.ws.listen();

const serverEnv = vite.environments[VITE_ENVIRONMENTS.SERVER];

let module: { main: () => Promise<INestApplication> };
if (isRunnableDevEnvironment(serverEnv)) {
  module = await serverEnv.runner.import(PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY);
} else {
  throw new Error("Server environment is not runnable");
}

const nestApp = await module.main();
const nestMiddleware = nestApp.getHttpAdapter().getInstance();

const app = express()
  .use(vite.middlewares)
  .use((req, res, next) => {
    if (req.url?.startsWith(`/api/v1/${appConfig.app.name}`)) return nestMiddleware(req, res);
    next();
  })
  .use("*", async (req, res) => {
    const html = await vite.transformIndexHtml(req.url, "");
    res.status(200).end(html);
  });

app.listen(viteConfig.server!.port, () => {
  logger.debug(`App (${microApp.name}) is running at http://localhost:${viteConfig.server?.port}`);
  parentPort?.postMessage({ status: "ok", port: viteConfig.server!.port! } satisfies WorkerMessage);
});
