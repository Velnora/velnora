import type { Package, Route, ServerSetupFn, Velnora, Router as VelnoraRouter, WithDefault } from "@velnora/schemas";

import { debug } from "../utils/debug";
import { Routing } from "./routing";

export class Router implements VelnoraRouter {
  private readonly routes: Route[] = [];
  private readonly cache = new Map<string, Route>();

  private readonly debug = debug.extend("router");

  private constructor(private readonly velnora: Velnora) {}

  get list() {
    return this.routes.toSorted((a, b) => b.path.split("/").length - a.path.split("/").length);
  }

  static create(velnora: Velnora) {
    return new Router(velnora);
  }

  register(route: Route) {
    this.routes.push(route);
    this.cache.set(route.id, route);
    return this;
  }

  parse(url: string) {
    const parsedUrl = new URL(url, "http://localhost");
    return { path: parsedUrl.pathname, query: parsedUrl.searchParams };
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  withApp(app: Package) {
    return new Routing(this, app);
  }

  async inject() {
    for (const route of this.list) {
      if (route.side === "frontend") {
        const getArgs = route.indexHtmlFile ? `?id=${route.id}` : null;
        this.velnora.http.handleRequest(new RegExp(`^${route.path}$`), async (req, res, next) => {
          const html = await this.velnora.viteServer.transformIndexHtml(`/index.html${getArgs ? getArgs : ""}`);
          res.end(html);
        });
      } else if (route.side === "backend") {
        const devEnv = this.velnora.viteServer.runnableDevEnv(route.environment);
        const appServer = await devEnv.runner.import<WithDefault<Promise<ReturnType<ServerSetupFn<unknown>>>>>(
          route.entry
        );

        if (!appServer || !appServer.default) {
          this.debug("injectModules skipping route injection, no default export found: %O", route);
          this.velnora.logger.warn(
            `Warning: Skipping backend route module injection, no default export found: ${route.entry}`
          );
          continue;
        }

        this.velnora.logger.log(`Injecting backend route module: ${route.entry}`);
        const handler = await appServer.default;
        const ctx = this.velnora.appContext.getOrCreateBackendHttpRouteContext(route);
        const serverHandler = await handler(ctx);
        this.debug("running backend route handler for route: %O", route.path);
        this.velnora.http.handleRequest(route.path, serverHandler.handler);
      }
    }
  }
}
