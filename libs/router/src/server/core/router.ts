import { Router as ClientRouter } from "../../client/core/router";
import type { Router as VelnoraRouter } from "../../client/types/router";
import type { SsrRequestContext } from "../../router/types/ssr-request-context";

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
