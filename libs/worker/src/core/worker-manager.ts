import { type Pool, type Proxy, Promise as WPromise, pool } from "workerpool";

type Workers = Record<string, (...args: any[]) => any>;

type Poolify<T> = { [K in keyof T]: Pool };

export class WorkerManager<TWorkers extends Record<string, Workers>> {
  private readonly workers = {} as Poolify<TWorkers>;

  isRegistered(worker: string): boolean;
  isRegistered<TWorker extends keyof TWorkers>(worker: TWorker): boolean;
  isRegistered(workerName: string) {
    return !!this.workers[workerName];
  }

  async register(name: string, worker: string): Promise<void>;
  async register<TWorker extends keyof TWorkers>(name: TWorker, worker: string): Promise<void>;
  async register(workerName: string, worker: string) {
    // @ts-expect-error
    this.workers[workerName] = pool(worker);
  }

  proxy<TWorker extends keyof TWorkers>(worker: TWorker): WPromise<Proxy<TWorkers[TWorker]>> {
    return this.workers[worker].proxy<TWorkers[TWorker]>();
  }

  terminate(worker: string): void;
  terminate<TWorker extends keyof TWorkers>(worker: TWorker): void;
  terminate(worker: string) {
    this.workers[worker].terminate();
  }

  terminateAll() {
    Object.keys(this.workers).forEach(worker => this.terminate(worker));
  }
}
