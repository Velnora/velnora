import { MessagePort, parentPort } from "worker_threads";

import { WORKER_EVENTS, type WorkerBaseEvents, type WorkerFns } from "@fluxora/types/worker";

import { logger } from "../utils/logger";

export class Worker<T extends WorkerFns, TEvents extends Record<string, any>> {
  private readonly parent: MessagePort = null!;
  private readonly listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(functions: T) {
    if (!parentPort) {
      logger.error("Worker can only be created in a worker thread.");
      return;
    }

    this.parent = parentPort!;

    this.emit(WORKER_EVENTS.FN_LIST, { functions: Object.keys(functions) });

    this.parent.on("message", message => {
      const subscribers = this.listeners.get(message.event);
      if (subscribers) {
        for (const subscriber of subscribers) {
          subscriber(message.data);
        }
      }
    });

    this.on(WORKER_EVENTS.FN_CALL, async callFn => {
      if (callFn.fn in functions) {
        const result = await functions[callFn.fn](...callFn.args);
        this.emit(WORKER_EVENTS.FN_CALL_RESULT, result);
      }
    });
  }

  private _isInitialized = false;

  get isInitialized() {
    return this._isInitialized;
  }

  emit<TEvent extends keyof WorkerBaseEvents>(event: TEvent, data: WorkerBaseEvents[TEvent]): this;
  emit<TEvent extends keyof TEvents>(event: TEvent, data: TEvents[TEvent]): this;
  emit(event: string, data?: any) {
    this.parent.postMessage({ event, data });
  }

  on<TEvent extends keyof WorkerBaseEvents>(event: TEvent, listener: (data: WorkerBaseEvents[TEvent]) => void): this;
  on<TEvent extends keyof TEvents>(event: TEvent, cb: (data: TEvents[TEvent]) => void): this;
  on(event: string, cb: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(cb);
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

  off<TEvent extends keyof WorkerBaseEvents>(event: TEvent, listener: (data: WorkerBaseEvents[TEvent]) => void): void;
  off<TEvent extends keyof TEvents>(event: TEvent, listener: (data: TEvents[TEvent]) => void): void;
  off(event: string, listener: (data: any) => void) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.delete(listener);
    return this;
  }
}
