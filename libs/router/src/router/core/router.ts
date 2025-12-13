import type { Request, Response } from "express";

import type {
  BackendRoute,
  FrontendRoute,
  FrontendSsrRoute,
  Logger,
  Package,
  Route,
  ServerHandler,
  ServerSetupFn,
  Velnora,
  VelnoraConfig,
  Router as VelnoraRouter,
  WithDefault
} from "@velnora/schemas";

import type { RenderFn } from "../types";
import type { SsrRequestContext } from "../types/ssr-request-context";
import { debug } from "../utils/debug";
import { isAsyncIterable } from "../utils/is-async-iterable";
import { isReadable } from "../utils/is-readable";
import { Routing } from "./routing";

export class Router implements VelnoraRouter {
  private readonly cache = new Map<string, Route>();

  private readonly debug = debug.extend("router");

  private readonly routes: Route[] = [];

  private readonly serverRoutes = new Map<Route, ServerHandler>();

  private constructor(
    private readonly velnora: Velnora,
    private readonly config: VelnoraConfig,
    private readonly logger: Logger
  ) {}

  static create(velnora: Velnora, config: VelnoraConfig, logger: Logger) {
    return new Router(velnora, config, logger);
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

  inject() {
    const routes = this.routes.toSorted(
      (a, b) =>
        b.path.split("/").filter(Boolean).length - a.path.split("/").filter(Boolean).length ||
        b.path.length - a.path.length
    );
    let rootRoute: Route | null = null;

    for (const route of routes) {
      if (route.path === "/") {
        rootRoute = route;
        continue;
      }
      this.injectRoute(route);
    }

    if (rootRoute) {
      this.injectRoute(rootRoute);
    }
  }

  private injectRoute(route: Route) {
    if (route.side === "backend") {
      this.injectBackend(route);
    } else if (route.renderMode === "ssr") {
      this.injectSSR(route);
    } else {
      this.injectCSR(route);
    }
  }

  private injectBackend(route: BackendRoute) {
    const devEnv = this.velnora.viteServer.runnableDevEnv(route.environment);

    this.velnora.http.handleRequest(route.path, async (req, res, next) => {
      const isInitialized = this.serverRoutes.has(route);

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
        this.serverRoutes.set(route, serverHandler);
      }

      const serverHandler = this.serverRoutes.get(route)!;
      this.debug("running backend route handler for route: %O", route.path);
      await serverHandler.handler(req, res, next);
    });
  }

  private injectCSR(route: FrontendRoute) {
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

  private injectSSR(route: FrontendSsrRoute) {
    this.velnora.http.handleRequest(route.path, async (req, res, next) => {
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

  private buildContext(req: Request, res: Response, route: FrontendSsrRoute): SsrRequestContext {
    const viteServer = this.velnora.viteServer;

    return {
      req,
      res,

      path: req.url,
      params: req.params,
      query: req.query,

      route,
      clientEnv: viteServer.environment(route.environment),
      serverEnv: viteServer.runnableDevEnv(route.ssr.environment),
      viteDevServer: viteServer.devServer,

      transformRouteIndexHtml(route: FrontendSsrRoute, html: string) {
        return viteServer.transformIndexHtml(`/index.html?ssr-mode=${route.ssr.mode}&id=${route.id}`, html);
      },

      app: route.app,
      config: this.config,
      vite: this.velnora.vite.withApp(route.app),

      logger: this.velnora.logger.extend({}),

      loadChunk(id: string) {},
      renderChild(appId: string, path: string) {
        return ``;
      }
    };
  }
}
