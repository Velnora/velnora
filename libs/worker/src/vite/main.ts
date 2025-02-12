import { type AppManagerEvents, appManager } from "@fluxora/common";
import { ErrorMessages, makeThrowable } from "@fluxora/utils";
import { workerManager } from "@fluxora/utils/worker";

import * as viteHandlers from "./core";

export type FluxoraViteWorker = typeof viteHandlers;

export const worker = workerManager.worker<FluxoraViteWorker, AppManagerEvents>(
  makeThrowable(viteHandlers, ErrorMessages.WORKER_APP_THROW_ERROR)
);
await appManager.communicateWithWorkers(worker);
