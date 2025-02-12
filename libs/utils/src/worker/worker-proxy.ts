import { inspect } from "node:util";
import { Worker } from "node:worker_threads";

import { type EventMessage, WORKER_EVENTS, type WorkerBaseEvents } from "@fluxora/types/worker";

import { logger } from "../utils/logger";

export class WorkerProxy<TEvents extends Record<string, any>> {
  private readonly listeners: Map<string, Set<(args: any) => any>> = new Map();

  constructor(
    private readonly worker: Worker,
    private readonly workerScript: string,
    private readonly name: string,
    private readonly functions: Set<string>
  ) {
    this.worker.on("message", (message: EventMessage) => {
      const { event, data } = message;
      this.call(event, data);
    });
  }

  private _isInitialized = false;

  get isInitialized() {
    return this._isInitialized;
  }

  on<TEvent extends keyof WorkerBaseEvents>(event: TEvent, listener: (data: WorkerBaseEvents[TEvent]) => void): this;
  on<TEvent extends keyof TEvents>(event: TEvent, listener: (data: TEvents[TEvent]) => void): this;
  on(event: string, listener: (data: any) => void) {
    if (event === WORKER_EVENTS.INITIALIZED && this.isInitialized) {
      listener(undefined);
      return this;
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    handlers.add(listener);

    return this;
  }

  once<TEvent extends keyof WorkerBaseEvents>(event: TEvent, listener: (data: WorkerBaseEvents[TEvent]) => void): this;
  once<TEvent extends keyof TEvents>(event: TEvent, listener: (data: TEvents[TEvent]) => void): this;
  once(event: string, listener: (data: any) => void) {
    const cb = (data: any) => {
      listener(data);
      this.off(event, cb);
    };
    this.on(event, cb);
    return this;
  }

  off<TEvent extends keyof WorkerBaseEvents>(event: TEvent, listener: (data: WorkerBaseEvents[TEvent]) => void): this;
  off<TEvent extends keyof TEvents>(event: TEvent, listener: (data: TEvents[TEvent]) => void): this;
  off(event: string, listener: (data: any) => void) {
    if (!this.listeners.has(event)) return this;

    const handlers = this.listeners.get(event)!;
    handlers.delete(listener);
    return this;
  }

  emit<TEvent extends keyof WorkerBaseEvents>(event: TEvent, data: WorkerBaseEvents[TEvent]): void;
  emit<TEvent extends keyof TEvents>(event: TEvent, data: TEvents[TEvent]): void;
  emit(event: string, data: any) {
    const structuredData = JSON.parse(JSON.stringify(data));
    this.worker.postMessage({ event, data: structuredData });
  }

  async init() {
    const resultPromise = Promise.withResolvers<WorkerBaseEvents[typeof WORKER_EVENTS.FN_LIST]>();
    this.once(WORKER_EVENTS.FN_LIST, result => resultPromise.resolve(result));
    const result = await resultPromise.promise;
    this._isInitialized = true;
    result.functions.forEach(fn => this.functions.add(fn));
    this.call(WORKER_EVENTS.INITIALIZED, undefined);
    logger.debug(
      `Worker (${this.name}) is initialized. (${result.functions.length} functions: ${result.functions.join(", ")})`
    );
  }

  [inspect.custom]() {
    return `WorkerProxy (${this.name}) ${inspect(
      {
        isInitialized: this.isInitialized,
        worker: `Worker (${this.workerScript})`,
        functions: Array.from(this.functions)
      },
      { colors: true }
    )}`;
  }

  private call(event: string, data: any) {
    if (this.listeners.has(event)) {
      for (const listener of this.listeners.get(event)!) {
        listener(data);
      }
    }

    if (event === WORKER_EVENTS.INITIALIZED) {
      this.listeners.delete(event);
    }
  }
}
