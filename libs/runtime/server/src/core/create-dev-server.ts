import { createHooks } from "hookable";

import type { DevCommandOptions } from "@velnora/commands";
import { createLogger } from "@velnora/core";
import { ContextManager, Injector, ModuleGraph, globals } from "@velnora/devkit/node";
import { TypeGenerator } from "@velnora/generator";
import { Router } from "@velnora/router";
import type { Hooks } from "@velnora/types";
import { IntegrationContainer, ViteContainer, ViteServer, vite } from "@velnora/vite-integration";

import { loadAndMergeConfig } from "../utils/load-and-merge-config";
import { Http } from "./http";
import { Velnora } from "./velnora";

export const createDevServer = async (options: DevCommandOptions) => {
  const startTime = performance.now();
  const hooks = createHooks<Hooks>();
  const config = await loadAndMergeConfig(options);
  globals.set("config", config);

  const graph = new ModuleGraph(config);
  await graph.indexWorkspace();

  const logger = createLogger(hooks);
  const router = Router.create(logger.extend({ logger: "router" }));

  const container = ViteContainer.create(config, graph, router, {
    server: { watch: config.server?.watch }
  });

  const typeGenerator = new TypeGenerator(logger.extend({ logger: "type-generator" }));

  const ctxManager = new ContextManager(container, router, typeGenerator, logger.extend({ logger: "context-manager" }));

  const integrationContainer = new IntegrationContainer(config, ctxManager, hooks);

  await graph.forEach(node => integrationContainer.configure(node));

  const http = Http.create(config);
  const viteServer = ViteServer.createDevServer(container, config, http);
  await viteServer.init();
  const injector = Injector.makeInjectable(config, http, router, viteServer, container, ctxManager, logger);

  http.on("close", () => void vite.close());

  return Velnora.construct(
    config,
    graph,
    router,
    integrationContainer,
    viteServer,
    http,
    injector,
    logger,
    performance.now() - startTime
  );
};
