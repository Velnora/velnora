import type { Promisable } from "type-fest";

import type { BackendHandler } from "./backend-handler";

export interface ServerHandler {
  handler: BackendHandler;
  dispose?(): Promisable<void>;
}
