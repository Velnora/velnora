import { workerManager } from "@fluxora/utils/worker";
import { type FluxoraViteWorker } from "@fluxora/worker/vite";

import { viteWorkerPath } from "./vite-worker-path";

export const workerPool = workerManager.pool<FluxoraViteWorker>(viteWorkerPath);
