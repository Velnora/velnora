import type { EventEmitter } from "node:events";
import type { Server } from "node:http";

import type { RequestHandler } from "express";
import type { Promisable } from "type-fest";

import type { ExtractParamsObject } from "./extract-params-object";

export interface Http extends EventEmitter {
  readonly app: Express.Application;
  readonly isRunning: boolean;

  use(...handlers: [RequestHandler, ...RequestHandler[]]): void;

  handleRequest(path: RegExp, ...handlers: RequestHandler[]): void;
  handleRequest<TPath extends string>(path: TPath, ...handlers: RequestHandler<ExtractParamsObject<TPath>>[]): void;

  listen(): Promise<void>;
  address(): ReturnType<Server["address"]>;
  close(): void;

  on(event: "close", listener: () => Promisable<void>): this;
}
