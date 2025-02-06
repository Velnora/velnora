export interface WorkerFns extends Record<string, (...args: any[]) => Promise<any>> {}
