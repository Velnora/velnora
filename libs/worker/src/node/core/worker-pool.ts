import { EventEmitter } from "events";
import { Worker } from "worker_threads";

import type {
  WorkerCallMessage,
  WorkerCallResult,
  WorkerEvent,
  WorkerEventType,
  WorkerFns,
  WorkerListEvent,
  WorkerProxy,
  WorkerUserEventsEvent
} from "@fluxora/types/worker";

import { logger } from "../utils/logger";

export class WorkerPool<T extends WorkerFns> {
  private readonly workers: Map<string, Worker>;
  private readonly proxies: Map<string, WorkerProxy<T>>;
  private readonly functionList: Map<string, Set<string>>;

  constructor(private readonly workerScript: string) {
    this.workers = new Map();
    this.proxies = new Map();
    this.functionList = new Map();
  }

  async new(name: string): Promise<WorkerProxy<T>> {
    if (this.workers.has(name)) {
      logger.warn(`Worker pool for ${name} already exists.`);
      return this.proxies.get(name) as WorkerProxy<T>;
    }

    const fnListPromise = Promise.withResolvers<void>();
    const proxy = new EventEmitter() as WorkerProxy<T>;
    const worker = new Worker(this.workerScript);
    const self = this;

    const messageHandlers: Partial<Record<WorkerEventType, (event: any) => void>> = {
      "fn:list": (event: WorkerListEvent) => {
        this.functionList.set(name, new Set(event.fns));
        fnListPromise.resolve();
      },
      "fn:userEvent": (event: WorkerUserEventsEvent) => {
        proxy.emit(event.userEvent, event.data);
      }
    };

    worker.on("message", (event: WorkerEvent) => {
      messageHandlers[event.type]?.(event);
    });

    proxy.on("emit", (userEvent: string, data: any) => {
      worker.postMessage({ type: "fn:userEvent", userEvent, data } as WorkerUserEventsEvent);
    });

    await fnListPromise.promise;

    const proxyWrapped = new Proxy(proxy, {
      get(target: any, prop: string) {
        if (self.functionList.get(name)?.has(prop)) {
          return async (...args: any[]) => {
            worker.postMessage({ type: "fn:call", fn: prop, args: args } as WorkerCallMessage);
            const resultPromise = Promise.withResolvers();

            worker.once("message", (event: WorkerCallResult) => {
              if (event.type === "fn:call:result" && event.fn === prop) {
                resultPromise.resolve(event.result);
              }
            });

            return await resultPromise.promise;
          };
        }

        return target[prop as keyof typeof target];
      },
      apply(target, _thisArg, args) {
        return target.emit(...args);
      }
    });

    this.workers.set(name, worker);
    this.proxies.set(name, proxyWrapped);

    logger.debug(`Worker pool for ${name} created.`);

    return await proxyWrapped;
  }

  proxy(name: string): Promise<WorkerProxy<T>> {
    if (!this.proxies.has(name)) {
      logger.warn(`Worker pool for ${name} does not exist.`);
      return this.new(name);
    }
    return Promise.resolve(this.proxies.get(name)!);
  }

  async terminate(name: string) {
    const worker = this.workers.get(name);
    if (worker) {
      await worker.terminate();
      this.workers.delete(name);
      this.proxies.delete(name);
      this.functionList.delete(name);
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
    this.functionList.clear();
  }
}
