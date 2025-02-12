import type { WorkerFns } from "@fluxora/types/worker";

import { Worker } from "./worker";
import { WorkerPool } from "./worker-pool";

class WorkerManager {
  pool<TWorkerFns extends WorkerFns, TEvents extends Record<string, any> = Record<string, any>>(workerScript: string) {
    return new WorkerPool<TWorkerFns, TEvents>(workerScript);
  }

  worker<TWorkerFns extends WorkerFns, TEvents extends Record<string, any> = Record<string, any>>(
    functions: TWorkerFns
  ) {
    return new Worker<TWorkerFns, TEvents>(functions);
  }
}

export const workerManager = new WorkerManager();
