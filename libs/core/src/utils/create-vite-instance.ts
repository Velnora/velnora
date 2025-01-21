import { createRequire } from "node:module";
import { Worker } from "node:worker_threads";

import type { FluxoraConfig, FluxoraConfigMethods, MicroApp } from "@fluxora/types/core";
import type { WorkerCreateServerData, WorkerMessage } from "@fluxora/types/worker";

const require = createRequire(import.meta.url);
const workerPath = require.resolve("@fluxora/worker");

export const createViteInstance = async (app: MicroApp, config: FluxoraConfig & FluxoraConfigMethods) => {
  const workerData: WorkerCreateServerData = { app, config: config.getRawConfig() };
  const worker = new Worker(workerPath, { workerData });
  return new Promise<number>((resolve, reject) => {
    worker.on("message", (message: WorkerMessage) => {
      if (message.status === "ok") {
        resolve(message.port);
      }
    });

    worker.on("error", err => {
      reject(err);
    });
  });
};
