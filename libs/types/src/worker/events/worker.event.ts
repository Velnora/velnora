import type { Prettify } from "../../common/prettify";
import type { Eventify } from "./eventify";
import type { WorkerCallMessage, WorkerCallResult } from "./worker-call.event";
import type { WorkerListEvent } from "./worker-list.event";

export const WORKER_EVENTS = {
  INITIALIZED: "initialized",
  FN_CALL: "fn:call",
  FN_CALL_RESULT: "fn:call:result",
  FN_LIST: "fn:list"
} as const;

export interface WorkerBaseEvents {
  [WORKER_EVENTS.INITIALIZED]: void;
  [WORKER_EVENTS.FN_CALL]: WorkerCallMessage;
  [WORKER_EVENTS.FN_CALL_RESULT]: WorkerCallResult;
  [WORKER_EVENTS.FN_LIST]: WorkerListEvent;
}

export type WorkerEvent<TEvents extends Record<string, any>> = Eventify<Prettify<WorkerBaseEvents & TEvents>>;
