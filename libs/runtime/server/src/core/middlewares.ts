import { EventEmitter } from "node:events";

import type { RequestHandler } from "express";
import type e from "express";

import type { ExtractParamsObject, Middlewares as VelnoraMiddlewares } from "@velnora/types";

import { debug } from "../utils/debug";

export class Middlewares extends EventEmitter implements VelnoraMiddlewares {
  private readonly debug = debug.extend("middlewares");

  protected constructor(readonly app: e.Application) {
    super();
  }

  use(...handlers: [RequestHandler, ...RequestHandler[]]) {
    this.app.use(...handlers);
    this.debug("handle-request registered global handlers: %O", { count: handlers.length });
  }

  handleRequest<TPossiblePath extends string>(
    path: TPossiblePath,
    ...handlers: RequestHandler<ExtractParamsObject<TPossiblePath>>[]
  ): void;
  handleRequest(path: RegExp, ...handlers: RequestHandler[]): void;
  handleRequest(path: string | RegExp, ...handlers: RequestHandler[]) {
    this.app.use(path, ...handlers);
    this.debug("handle-request registered route handler: %O", {
      route: path,
      handlersCount: handlers.length
    });
  }
}
