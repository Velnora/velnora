import type { IncomingMessage, ServerResponse } from "node:http";
import type { Stream } from "node:stream";

import type { ParsedQs } from "qs";
import type { Promisable } from "type-fest";
import type { Environment, RunnableDevEnvironment, ViteDevServer } from "vite";

import type { FrontendSsrRoute, Logger, Package, VelnoraConfig, ViteApi } from "@velnora/schemas";

export interface SsrRequestContext {
  req: IncomingMessage;
  res: ServerResponse;

  path: string;
  params: Record<string, string>;
  query: ParsedQs;

  // Environments
  route: FrontendSsrRoute;
  clientEnv: Environment;
  serverEnv: RunnableDevEnvironment;
  viteDevServer: ViteDevServer;

  // App/runtime
  app: Package;
  config: VelnoraConfig;
  vite: ViteApi;

  // Logging
  logger: Logger;

  transformRouteIndexHtml(route: FrontendSsrRoute, html: string): Promisable<string>;

  // For microfrontends / RSC later
  loadChunk(id: string): Promisable<unknown>;
  renderChild(appId: string, path: string): Promisable<string | Stream>;
}
