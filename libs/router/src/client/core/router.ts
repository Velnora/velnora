import type { Package } from "@velnora/types";

import type { PathObject, PublicRouter } from "../types";
import type { Router as VelnoraRouter } from "../types/router";
import { GlobalRouter } from "./global-router";

export class Router implements VelnoraRouter {
  protected constructor(
    private readonly app: Package,
    private readonly instance: GlobalRouter
  ) {}

  get path() {
    return window.location.pathname.replace(new RegExp(`^${this.app.clientUrl}`), "") || "/";
  }

  get pathObject() {
    return this.instance.getPathObject(this.path, this.app);
  }

  static create(app: Package) {
    const instance = GlobalRouter.instance();
    let router = instance.getRouter(app);
    if (router) return router;
    router = new Router(app, instance);
    GlobalRouter.register(app, router);
    return router;
  }

  getPublicInterface(): PublicRouter {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return {
      navigate(target: string) {
        self.instance.navigate(self.app, target);
      },
      replace(path: string) {
        self.instance.replace(self.app, path);
      },
      back() {
        self.instance.back(self.app);
      },
      forward() {
        self.instance.forward(self.app);
      },
      reload() {
        self.instance.reload();
      }
    };
  }

  subscribe(listener: (path: PathObject, previousPath?: PathObject | null) => void) {
    return this.instance.subscribe(this.app, listener);
  }
}
