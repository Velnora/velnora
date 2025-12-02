import type { IncomingMessage, ServerResponse } from "node:http";

import type { Promisable } from "type-fest";

export type BackendHandler = (request: IncomingMessage, response: ServerResponse) => Promisable<void>;
