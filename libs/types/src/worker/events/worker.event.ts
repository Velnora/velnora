import type { WorkerCallMessage, WorkerCallResult } from "./worker-call.event";
import type { WorkerListEvent } from "./worker-list.event";
import type { WorkerUserEventsEvent } from "./worker-user-events.event";

export type WorkerEvent = WorkerCallMessage | WorkerCallResult | WorkerListEvent | WorkerUserEventsEvent;
