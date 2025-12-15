import { createHooks } from "hookable";

import type { DevCommandOptions } from "@velnora/cli";
import { createLogger } from "@velnora/core";
import { Injector, ModuleGraph } from "@velnora/devkit/node";
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

  const graph = new ModuleGraph(config);
  await graph.indexWorkspace();
  await graph.forEach(node => node.fetchConfig());

  const logger = createLogger(hooks);
  const router = Router.create(logger.extend({ logger: "router" }));

  const container = ViteContainer.create(config, router, {
    server: { watch: config.server?.watch }
  });

  const integrationContainer = new IntegrationContainer(
    config,
    router,
    hooks,
    container,
    logger.extend({ logger: "integration-container" })
  );

  await graph.forEach(node => integrationContainer.configure(node));

  const http = Http.create(config);
  const viteServer = ViteServer.createDevServer(container, config, http);
  await viteServer.init();
  const injector = Injector.makeInjectable(config, http, router, viteServer, container, logger);

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
