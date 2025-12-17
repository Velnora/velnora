import type { EventEmitter } from "node:events";
import type { Server } from "node:http";

import type { Promisable } from "type-fest";

import type { Middlewares } from "./middlewares";

export interface Http extends Middlewares, EventEmitter {
  readonly app: Express.Application;
  readonly isRunning: boolean;

  listen(): Promise<void>;
  address(): ReturnType<Server["address"]>;
  printUrls(): void;
  close(): void;

  getMiddlewares(): Middlewares;

  on(event: "close", listener: () => Promisable<void>): this;
}
