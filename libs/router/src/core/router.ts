import type { NextFunction, Request, Response } from "express";

import type { Router as VelnoraRouter } from "@velnora/schemas";

export class Router implements VelnoraRouter {
  static create() {
    return new Router();
  }

  private constructor() {}

  async handleRequest(request: Request, res: Response, next: NextFunction) {}
}
