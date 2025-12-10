import type { Request, Response } from "express";

import type {
  FrontendSSrRoute,
  Logger,
  Package,
  Route,
  ServerHandler,
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

  private constructor(
    private readonly velnora: Velnora,
    private readonly logger: Logger
  ) {}

  static create(velnora: Velnora, logger: Logger) {
    return new Router(velnora, logger);
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

  inject() {
    this.injectBackend();
    this.injectSSR();
    this.injectCSR();
  }

  private injectBackend() {
    const setupRoutes = new Map<Route, ServerHandler>();

    for (const route of this.routingTable.backend) {
      const devEnv = this.velnora.viteServer.runnableDevEnv(route.environment);

      this.velnora.http.handleRequest(route.path, async (req, res, next) => {
        const isInitialized = setupRoutes.has(route);

        if (!isInitialized) {
          this.debug("Initializing backend route module for route: %O", route);
          this.logger.log(`Initializing backend route module: ${route.entry}`);
          const appServer = await devEnv.runner.import<WithDefault<Promise<ReturnType<ServerSetupFn<unknown>>>>>(
            route.entry
          );

          if (!appServer || !appServer.default) {
            this.debug("injectModules skipping route injection, no default export found: %O", route);
            this.velnora.logger.warn(
              `Warning: Skipping backend route module injection, no default export found: ${route.entry}`
            );
            return next();
          }

          this.velnora.logger.log(`Injecting backend route module: ${route.entry}`);
          const handler = await appServer.default;
          const ctx = this.velnora.appContext.getOrCreateBackendHttpRouteContext(route);
          const serverHandler = await handler(ctx);
          setupRoutes.set(route, serverHandler);
        }

        const serverHandler = setupRoutes.get(route)!;
        this.debug("running backend route handler for route: %O", route.path);
        await serverHandler.handler(req, res, next);
      });
    }
  }

  private injectCSR() {
    for (const route of this.routingTable.csr) {
      const getArgs = route.indexHtmlFile ? `?id=${route.id}` : null;
      this.velnora.http.handleRequest(route.path, async (_req, res, next) => {
        try {
          const html = await this.velnora.viteServer.transformIndexHtml(`/index.html${getArgs ? getArgs : ""}`);
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    }
  }

  private injectSSR() {
    const setupRoutes = new Map<Route, RenderFn>();

    for (const route of this.routingTable.ssr) {
      this.velnora.http.handleRequest(route.path, async (req, res, next) => {
        const isInitialized = setupRoutes.has(route);

        if (!isInitialized) {
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
          this.velnora.logger.log(`Injecting SSR route module: ${route.ssr.entry}`);
          setupRoutes.set(route, render);
        }

        const render = setupRoutes.get(route)!;
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
              await this.velnora.viteServer.transformIndexHtml(
                `/index.html?ssr-mode=${route.ssr.mode}&id=${route.id}`,
                body.toString()
              )
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
