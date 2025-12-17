import type { RequestHandler } from "express";

import type { ExtractParamsObject } from "@velnora/types";

export interface Middlewares {
  use(...handlers: [RequestHandler, ...RequestHandler[]]): void;

  handleRequest(path: string | RegExp, ...handlers: RequestHandler[]): void;
  handleRequest<TPath extends string>(path: TPath, ...handlers: RequestHandler<ExtractParamsObject<TPath>>[]): void;
}
