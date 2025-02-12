import { Worker } from "node:worker_threads";

import { WORKER_EVENTS, type WorkerFns } from "@fluxora/types/worker";

import { logger } from "../utils/logger";
import { WorkerProxy } from "./worker-proxy";

type Promisified<TObject extends Record<string, (...args: any[]) => any>> = {
  [K in keyof TObject]: TObject[K] extends (...args: infer TArgs) => infer TReturn
    ? (...args: TArgs) => Promise<Awaited<TReturn>>
    : TObject[K];
};

export class WorkerPool<TWorkerFns extends WorkerFns, TEvents extends Record<string, any>> {
  private readonly workers: Map<string, Worker>;
  private readonly proxies: Map<string, WorkerProxy<TEvents> & Promisified<TWorkerFns>>;
  private readonly functions = new Set<string>();

  constructor(private readonly workerScript: string) {
    this.workers = new Map();
    this.proxies = new Map();
  }

  new(name: string) {
    if (this.workers.has(name)) {
      logger.warn(`Worker pool for ${name} already exists.`);
      return this.proxies.get(name)!;
    }

    const worker = new Worker(this.workerScript);
    const proxy = new WorkerProxy(worker, this.workerScript, name, this.functions);
    const workerFunctions = this.functions;

    worker.on("error", console.error.bind(console));
    worker.on("messageerror", console.error.bind(console));

    const wrappedProxy = new Proxy(proxy as WorkerProxy<TEvents> & Promisified<TWorkerFns>, {
      get(target, prop: string) {
        if (!target.isInitialized && !(prop in target)) {
          logger.warn(
            `Worker pool for ${name} is not initialized yet. Calling "${prop}" before initialization may result in unexpected behavior.`
          );
          return async () => {};
        }

        if (workerFunctions.has(prop)) {
          return async (...args: any[]) => {
            const resultPromise = Promise.withResolvers();

            proxy.emit(WORKER_EVENTS.FN_CALL, { fn: prop, args: args });
            proxy.once(WORKER_EVENTS.FN_CALL_RESULT, result => resultPromise.resolve(result));

            return await resultPromise.promise;
          };
        }

        return target[prop as keyof typeof target];
      }
    });

    this.workers.set(name, worker);
    this.proxies.set(name, wrappedProxy);

    return wrappedProxy;
  }

  proxy(): (WorkerProxy<TEvents> & Promisified<TWorkerFns>)[];
  proxy(name: string): WorkerProxy<TEvents> & Promisified<TWorkerFns>;
  proxy(name?: string) {
    if (!name) {
      return Array.from(this.proxies.values());
    }

    if (!this.proxies.has(name)) {
      logger.warn(`Worker pool for ${name} does not exist.`);
      return this.new(name);
    }

    return this.proxies.get(name)!;
  }

  async terminate(name: string) {
    const worker = this.workers.get(name);
    if (worker) {
      await worker.terminate();
      this.workers.delete(name);
      this.proxies.delete(name);
      logger.debug(`Worker pool for ${name} terminated.`);
    } else {
      logger.warn(`No worker pool found for ${name}.`);
    }
  }

  async terminateAll() {
    for (const [name, worker] of this.workers) {
      await worker.terminate();
      logger.debug(`Worker pool for ${name} terminated.`);
    }
    this.workers.clear();
    this.proxies.clear();
  }
}
