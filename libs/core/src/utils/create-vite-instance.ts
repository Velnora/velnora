import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";

import type { FluxoraConfig, FluxoraConfigMethods, MicroApp } from "@fluxora/types/core";
import type { WorkerCreateServerData, WorkerMessage } from "@fluxora/types/worker";

export const createViteInstance = async (app: MicroApp, config: FluxoraConfig & FluxoraConfigMethods) => {
  const worker = new Worker(resolve(fileURLToPath(import.meta.url), "../fluxora.worker.js"), {
    workerData: { app, config: config.getRawConfig() } satisfies WorkerCreateServerData
  });
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
