import { createServer as createHttpServer } from "node:http";
import type { Server as HttpServer } from "node:http";

import express from "express";

import type { VelnoraConfig, Http as VelnoraHttp } from "@velnora/types";

import { debug } from "../utils/debug";
import { Middlewares } from "./middlewares";

export class Http extends Middlewares implements VelnoraHttp {
  private readonly _debug = debug.extend("http");

  declare private server: HttpServer;

  private constructor(private readonly config: VelnoraConfig) {
    super(express());
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

  async listen() {
    const resolvers = Promise.withResolvers<void>();

    this.server = createHttpServer(this.app).listen(this.port, this.host, () => {
      this._debug("listen server started listening: %O", { host: this.host, port: this.port });
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

  getMiddlewares() {
    return new Middlewares(this.app);
  }

  close() {
    this._debug("closing server");
    if (!this.server) throw new Error("Server is not running");
    this.server.close();
  }

  private addListenerToServer(event: string) {
    this.server.addListener(event, (...args: unknown[]) => this.emit(event, ...args));
  }
}
