import { EventEmitter } from "node:events";
import { createServer as createHttpServer } from "node:http";
import type { Server as HttpServer } from "node:http";

import type { RequestHandler } from "express";
import express from "express";

import type { ExtractParamsObject, VelnoraConfig, Http as VelnoraHttp } from "@velnora/types";

import { debug } from "../utils/debug";

export class Http extends EventEmitter implements VelnoraHttp {
  private readonly debug = debug.extend("http");
  readonly app = express();

  declare private server: HttpServer;

  private constructor(private readonly config: VelnoraConfig) {
    super();
  }

  get isRunning() {
    return !!this.server && this.server.listening;
  }

  get host() {
    return this.config.server?.host || "::";
  }

  get port() {
    return this.config.server?.port || 4173;
  }

  static create(config: VelnoraConfig) {
    return new Http(config);
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

  async listen() {
    const resolvers = Promise.withResolvers<void>();

    this.server = createHttpServer(this.app).listen(this.port, this.host, () => {
      this.debug("listen server started listening: %O", { host: this.host, port: this.port });
      resolvers.resolve();
    });

    [
      "close",
      "connection",
      "error",
      "listening",
      "checkContinue",
      "checkExpectation",
      "clientError",
      "connect",
      "dropRequest",
      "request",
      "upgrade"
    ].forEach(event => this.addListenerToServer(event));

    await resolvers.promise;
  }

  address() {
    if (!this.server) throw new Error("Server is not running");
    return this.server.address();
  }

  close() {
    this.debug("closing server");
    if (!this.server) throw new Error("Server is not running");
    this.server.close();
  }

  private addListenerToServer(event: string) {
    this.server.addListener(event, (...args: unknown[]) => this.emit(event, ...args));
  }
}
