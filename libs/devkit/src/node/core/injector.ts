import type { Request, Response } from "express";

import type {
  BackendRoute,
  FrontendRoute,
  FrontendSsrRoute,
  Http,
  Logger,
  RenderFn,
  Route,
  Router,
  ServerHandler,
  ServerSetupFn,
  SsrRequestContext,
  VelnoraConfig,
  ViteContainer,
  ViteServer,
  WithDefault
} from "@velnora/types";

import { debug } from "../utils/debug";
import { isAsyncIterable } from "../utils/is-async-iterable";
import { isReadable } from "../utils/is-readable";
import { ContextManager } from "./context-manager";

export class Injector {
  private readonly debug = debug.extend("injector");
  private readonly contextManager: ContextManager;

  private readonly serverRoutes = new Map<Route, ServerHandler>();

  private constructor(
    private readonly config: VelnoraConfig,
    private readonly http: Http,
    private readonly router: Router,
    private readonly viteServer: ViteServer,
    private readonly container: ViteContainer,
    private readonly logger: Logger
  ) {
    this.contextManager = new ContextManager(this.logger.extend({ logger: "context-manager" }));
  }

  static makeInjectable(
    config: VelnoraConfig,
    http: Http,
    router: Router,
    viteServer: ViteServer,
    container: ViteContainer,
    logger: Logger
  ) {
    return new Injector(config, http, router, viteServer, container, logger);
  }

  inject() {
    const routes = this.router.getRoutes();

    for (const route of routes) {
      this.injectRoute(route);
    }

    this.injectExtensions();
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
    const devEnv = this.viteServer.runnableDevEnv(route.environment);

    this.http.handleRequest(route.path, async (req, res, next) => {
      const isInitialized = this.serverRoutes.has(route);

      if (!isInitialized) {
        this.debug("Initializing backend route module for route: %O", route);
        this.logger.log(`Initializing backend route module: ${route.entry}`);
        const appServer = await devEnv.runner.import<WithDefault<Promise<ReturnType<ServerSetupFn<unknown>>>>>(
          route.entry
        );

        if (!appServer || !appServer.default) {
          this.debug("injectModules skipping route injection, no default export found: %O", route);
          this.logger.warn(`Warning: Skipping backend route module injection, no default export found: ${route.entry}`);
          return next();
        }

        this.logger.log(`Injecting backend route module: ${route.entry}`);
        const handler = await appServer.default;
        const ctx = this.contextManager.getFor(route);
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

    this.http.handleRequest(
      this.config.apps.csrAppRedirectToIndexHtml ? route.path : new RegExp(`^${route.path}$`),
      async (_req, res, next) => {
        try {
          const html = await this.viteServer.transformIndexHtml(`/index.html${getArgs ? getArgs : ""}`);
          res.end(html);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  private injectSSR(route: FrontendSsrRoute) {
    this.http.handleRequest(route.path, async (req, res, next) => {
      const env = this.viteServer.runnableDevEnv(route.ssr.environment);
      const mod = await env.runner.import<Record<string, RenderFn>>(route.ssr.entry);
      const render = mod[route.ssr.exportName ?? "default"];
      if (!render) {
        this.debug("injectModules skipping route injection, no render export found: %O", route);
        this.logger.warn(
          `Warning: Skipping frontend route module injection, no render function export found in ${route.ssr.entry}`
        );
        return;
      }
      this.logger.log(`Injecting SSR route module: ${route.ssr.entry}`);

      try {
        const result = await render(this.buildContext(req, res, route));

        if (result.status && result.status >= 400) {
          this.logger.log(`SSR route returned status ${result.status} for path: ${req.url}`);
          next();
          return;
        }

        if (result.status) res.status(result.status);
        if (result.headers) {
          for (const [k, v] of Object.entries(result.headers)) {
            res.setHeader(k, v);
          }
        }

        const body = result.body;

        if (typeof body === "string" || Buffer.isBuffer(body) || body instanceof Uint8Array) {
          res.end(
            await this.viteServer.transformIndexHtml(
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

  private injectExtensions() {
    this.http.use((req, res) => {
      res.setHeader("Content-Type", "text/html").end("404 Not Found");
    });
  }

  private buildContext(req: Request, res: Response, route: FrontendSsrRoute): SsrRequestContext {
    const viteServer = this.viteServer;

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
      vite: this.container.withApp(route.app),

      logger: this.logger.extend({}),

      loadChunk(id: string) {},
      renderChild(appId: string, path: string) {
        return ``;
      }
    };
  }
}
