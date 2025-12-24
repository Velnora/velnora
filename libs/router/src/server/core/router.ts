import type { SsrRequestContext } from "@velnora/types";

import { Router as ClientRouter, type GlobalRouter } from "../../client/core";
import type { Router as VelnoraRouter } from "../../client/types/router";

export class Router extends ClientRouter implements VelnoraRouter {
  static createRouter(ctx: SsrRequestContext, globalRouter: GlobalRouter) {
    return new Router(ctx, globalRouter);
  }

  protected constructor(
    private readonly ctx: SsrRequestContext,
    globalRouter: GlobalRouter
  ) {
    super(ctx.app, globalRouter);
  }

  get path() {
    return this.ctx.path;
  }
}
