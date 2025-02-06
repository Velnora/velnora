import { type FluxoraViteWorker, workerManager } from "@fluxora/worker";

import { viteWorkerPath } from "./vite-worker-path";

export const viteWorkerManager = workerManager.pool<FluxoraViteWorker>(viteWorkerPath);
