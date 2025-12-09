import type { IncomingMessage, ServerResponse } from "node:http";
import type { Stream } from "node:stream";

import type { ParsedQs } from "qs";
import type { Promisable } from "type-fest";
import type { Environment, RunnableDevEnvironment } from "vite";

import type { FrontendSSrRoute, Logger, Package, ViteApi } from "@velnora/schemas";

export interface SsrRequestContext {
  req: IncomingMessage;
  res: ServerResponse;

  path: string;
  params: Record<string, string>;
  query: ParsedQs;

  // Environments
  route: FrontendSSrRoute;
  clientEnv: Environment;
  serverEnv: RunnableDevEnvironment;

  // App/runtime
  app: Package;
  vite: ViteApi;

  // Logging
  logger: Logger;

  // For microfrontends / RSC later
  loadChunk(id: string): Promisable<unknown>;
  renderChild(appId: string, path: string): Promisable<string | Stream>;
}
