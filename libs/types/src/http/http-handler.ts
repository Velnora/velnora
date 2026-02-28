/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { IncomingMessage, ServerResponse } from "node:http";

import type { Promisable } from "type-fest";

export interface HttpHandler {
  (req: IncomingMessage, res: ServerResponse): Promisable<void>;
  (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void): Promisable<void>;
}
