import { workerManager } from "@fluxora/utils/worker";
import { type FluxoraViteWorker } from "@fluxora/worker/vite";

import { viteWorkerScript } from "./vite-worker-script";

export const workerPool = workerManager.pool<FluxoraViteWorker>(viteWorkerScript);
