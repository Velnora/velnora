export interface WorkerFns extends Record<string, (...args: any[]) => any | Promise<any>> {}
