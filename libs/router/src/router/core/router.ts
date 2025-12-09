import type { Request, Response } from "express";

import type {
  FrontendSSrRoute,
  Package,
  Route,
  ServerSetupFn,
  Velnora,
  Router as VelnoraRouter,
  WithDefault
} from "@velnora/schemas";

import type { RenderFn } from "../types";
import type { RoutingTable } from "../types/routing-table";
import type { SsrRequestContext } from "../types/ssr-request-context";
import { debug } from "../utils/debug";
import { isAsyncIterable } from "../utils/is-async-iterable";
import { isReadable } from "../utils/is-readable";
import { Routing } from "./routing";

export class Router implements VelnoraRouter {
  private readonly cache = new Map<string, Route>();

  private readonly debug = debug.extend("router");

  private readonly routingTable: RoutingTable = { backend: [], csr: [], ssr: [] };

  private constructor(private readonly velnora: Velnora) {}

  static create(velnora: Velnora) {
    return new Router(velnora);
  }

  register(route: Route) {
    if (route.side === "backend") {
      this.routingTable.backend.push(route);
    } else if (route.side === "frontend" && route.renderMode === "csr") {
      this.routingTable.csr.push(route);
    } else if (route.side === "frontend" && route.renderMode === "ssr") {
      this.routingTable.ssr.push(route);
    }

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
    await this.injectBackend();
    await this.injectSSR();
    this.injectCSR();
  }

  private async injectBackend() {
    for (const route of this.routingTable.backend) {
      const devEnv = this.velnora.viteServer.runnableDevEnv(route.environment);
      const appServer = await devEnv.runner.import<WithDefault<Promise<ReturnType<ServerSetupFn<unknown>>>>>(
        route.entry
      );

      if (!appServer || !appServer.default) {
        this.debug("injectModules skipping route injection, no default export found: %O", route);
        this.velnora.logger.warn(
          `Warning: Skipping backend route module injection, no default export found: ${route.entry}`
        );
        return;
      }

      this.velnora.logger.log(`Injecting backend route module: ${route.entry}`);
      const handler = await appServer.default;
      const ctx = this.velnora.appContext.getOrCreateBackendHttpRouteContext(route);
      const serverHandler = await handler(ctx);
      this.debug("running backend route handler for route: %O", route.path);
      this.velnora.http.handleRequest(route.path, serverHandler.handler);
    }
  }

  private injectCSR() {
    for (const route of this.routingTable.csr) {
      const getArgs = route.indexHtmlFile ? `?id=${route.id}` : null;
      this.velnora.http.handleRequest(new RegExp(`^${route.path}$`), async (req, res, next) => {
        try {
          const html = await this.velnora.viteServer.transformIndexHtml(`/index.html${getArgs ? getArgs : ""}`);
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    }
  }

  private async injectSSR() {
    for (const route of this.routingTable.ssr) {
      const env = this.velnora.viteServer.runnableDevEnv(route.ssr.environment);
      const mod = await env.runner.import<Record<string, RenderFn>>(route.ssr.entry);
      const render = mod[route.ssr.exportName ?? "default"];
      if (!render) {
        this.debug("injectModules skipping route injection, no render export found: %O", route);
        this.velnora.logger.warn(
          `Warning: Skipping frontend route module injection, no render function export found in ${route.ssr.entry}`
        );
        return;
      }

      this.velnora.http.handleRequest(route.path, async (req, res, next) => {
        try {
          const result = await render(this.buildContext(req, res, route));

          if (result.status) res.status(result.status);
          if (result.headers) {
            for (const [k, v] of Object.entries(result.headers)) {
              res.setHeader(k, v);
            }
          }

          const body = result.body;
          if (typeof body === "string" || Buffer.isBuffer(body) || body instanceof Uint8Array) {
            res.end(
              await this.velnora.viteServer.transformIndexHtml(`/index.html?ssr&id=${route.id}`, body.toString())
            );
            return;
          }

          if (isAsyncIterable(body)) {
            for await (const chunk of body) {
              res.write(chunk);
            }

            res.end();
            return;
          }

          if (isReadable(body)) {
            body.pipe(res);
            return;
          }

          res.end("");
        } catch (err) {
          next(err);
        }
      });
    }
  }

  private buildContext(req: Request, res: Response, route: FrontendSSrRoute): SsrRequestContext {
    return {
      req,
      res,

      path: req.url,
      params: req.params,
      query: req.query,

      route,
      clientEnv: this.velnora.viteServer.environment(route.environment),
      serverEnv: this.velnora.viteServer.runnableDevEnv(route.ssr.environment),

      app: route.app,

      vite: this.velnora.vite.withApp(route.app),

      logger: this.velnora.logger.extend({}),

      loadChunk(id: string) {},
      renderChild(appId: string, path: string) {
        return ``;
      }
    };
  }
}
