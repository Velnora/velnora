import { parentPort, workerData } from "worker_threads";

import express from "express";
import { createServer } from "vite";

import { getClientConfiguration } from "./core/configuration/client";
import { getServerConfiguration } from "./core/configuration/server";
import type { WorkerCreateServerData } from "./types/worker-create-server-data";
import type { WorkerMessage } from "./types/worker-message";
import { FluxoraAppConfigBuilder } from "./utils/fluxora-app-config.builder";
import { logger } from "./utils/logger";

const data = workerData as WorkerCreateServerData;
const { app: microApp, config, isClient } = data;

const appConfigBuilder = await FluxoraAppConfigBuilder.from(microApp, config);
const appConfig = await appConfigBuilder.setRemoteEntry().retrieveViteConfigFile().build();
const viteConfig = isClient ? await getClientConfiguration(appConfig) : getServerConfiguration(appConfig);
const vite = await createServer(viteConfig);

const app = express().use(vite.middlewares);

if (isClient) {
  app.use("*", async (req, res) => {
    const html = await vite.transformIndexHtml(req.url, "");
    res.status(200).end(html);
  });
  vite.ws.listen();
}

app.listen(viteConfig.server!.port, () => {
  const side = isClient ? "Frontend" : "Backend";
  logger.debug(`${side} for ${app.name} is running at http://localhost:${viteConfig.server?.port}`);
  parentPort?.postMessage({ status: "ok", port: viteConfig.server!.port! } satisfies WorkerMessage);
});
