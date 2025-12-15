import type { IncomingMessage, ServerResponse } from "node:http";

import type { NextFunction } from "express";
import type { Promisable } from "type-fest";

export type BackendHandler = (
  request: IncomingMessage,
  response: ServerResponse,
  next: NextFunction
) => Promisable<void>;
