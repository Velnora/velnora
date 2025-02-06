import { EventEmitter } from "events";

import type { WorkerFns } from "./worker-fns";

export type WorkerProxy<T extends WorkerFns> = T & EventEmitter;
