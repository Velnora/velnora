import { EventEmitter } from "events";
import { isMainThread, parentPort } from "worker_threads";

import type { WorkerCallMessage, WorkerCallResult, WorkerFns, WorkerListEvent } from "@fluxora/types/worker";

import { WorkerPool } from "./worker-pool";

class WorkerManager {
  pool<T extends WorkerFns>(workerScript: string) {
    return new WorkerPool<T>(workerScript);
  }

  worker<T extends WorkerFns>(functions: T) {
    const parent = parentPort;
    if (!isMainThread && parent) {
      parent.postMessage({ type: "fn:list", fns: Object.keys(functions) } as WorkerListEvent);

      parent.on("message", async (event: WorkerCallMessage) => {
        if (event.type === "fn:call" && event.fn in functions) {
          const fn = functions[event.fn];
          const result = await fn(...event.args);
          parent.postMessage({ type: "fn:call:result", fn: event.fn, result } as WorkerCallResult);
        }
      });
    }

    return new Proxy(new EventEmitter(), {
      get: (target, prop: string) => target[prop as keyof typeof target],
      apply: (target, _thisArg, args: [string, ...any[]]) => target.emit(...args)
    });
  }
}

export const workerManager = new WorkerManager();
