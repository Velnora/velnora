import { IncomingMessage, ServerResponse } from "node:http";

import type { Middleware } from "../types/middleware";
import { Request } from "./request";
import { Response } from "./response";

export class HttpAdapterBase {
  constructor(private readonly instance: any) {}

  use(pathOrMiddleware: string | RegExp | Middleware, ...middlewares: Middleware[]) {
    this.instance.use(pathOrMiddleware, ...middlewares);
    return this;
  }

  get handler() {
    return (req: IncomingMessage, res: ServerResponse) => {
      Object.assign(req, Request.prototype);
      Object.assign(res, Response.prototype);
      this.instance(req, res);
    };
  }
}
