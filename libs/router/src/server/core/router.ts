import type { SsrRequestContext } from "@velnora/types";

import { Router as ClientRouter } from "../../client/core/router";
import type { Router as VelnoraRouter } from "../../client/types/router";

export class Router extends ClientRouter implements VelnoraRouter {
  static createRouter(ctx: SsrRequestContext) {
    return new Router(ctx);
  }

  protected constructor(private readonly ctx: SsrRequestContext) {
    super(ctx.app);
  }

  get path() {
    return this.ctx.path;
  }
}
