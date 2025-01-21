import { type FluxoraViteWorker, WorkerManager } from "@fluxora/worker";

export const viteWorkerManager = new WorkerManager<Record<string, FluxoraViteWorker>>();
