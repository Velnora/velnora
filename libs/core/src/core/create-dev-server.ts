import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createServer as viteCreateServer } from "vite";

import type { CreateServerOptions, FluxoraApp } from "@fluxora/core";

import { checkAndGenerateGitignore } from "../utils/check-and-generate-gitignore";
import { FluxoraConfigBuilder } from "../utils/fluxora-config.builder";
import { logger } from "../utils/logger";
import { resolveUserConfig } from "../utils/resolve-user-config";
import { getClientConfiguration } from "./configuration/client";
import { getServerConfiguration } from "./configuration/server";

declare module "vite" {
  interface ViteDevServer {
    appConfig: FluxoraApp;
  }
}

export const createDevServer = async (options: CreateServerOptions) => {
  const userConfig = await resolveUserConfig();
  const config = await new FluxoraConfigBuilder(userConfig)
    .resolveTemplate()
    .resolveApps()
    .retrieveCacheOptions()
    .build();
  const app = express();

  await config.configureApps(config => {
    config.assignHost(false).setRemoteEntry().retrieveViteConfigFile();
  });

  await config.withApps(async config => {
    const clientViteConfig = await getClientConfiguration(config, { mode: options.env });
    const client = await viteCreateServer(clientViteConfig);
    client.appConfig = config;
    config.client.vite.devServer = client;
    config.client.vite.config = clientViteConfig;
    config.client.server = express()
      .use(client.middlewares)
      .get("*", async (req, res) => {
        const html = await client.transformIndexHtml(req.url, "");
        res.status(200).end(html);
      })
      .listen(clientViteConfig.server?.port, () => {
        logger.debug(`Frontend for ${config.app.name} is running at http://localhost:${clientViteConfig.server?.port}`);
      });
    app.use(
      `/${config.app.name}`,
      createProxyMiddleware({ target: `http://localhost:${clientViteConfig.server?.port}` })
    );

    const serverViteConfig = getServerConfiguration(config, { mode: options.env });
    const server = await viteCreateServer(serverViteConfig);
    server.appConfig = config;
    config.server.vite.devServer = server;
    config.server.vite.config = serverViteConfig;
    config.server.server = express()
      .use(server.middlewares)
      .listen(serverViteConfig.server?.port, () => {
        logger.debug(`Backend for ${config.app.name} is running at http://localhost:${serverViteConfig.server?.port}`);
      });
    app.use(
      `/api/v1/${config.app.name}`,
      createProxyMiddleware({
        target: `http://localhost:${serverViteConfig.server?.port}/api/v1/${config.app.name}`
      })
    );
  });

  app.all("*", (_req, res) => {
    res.json({ done: false });
  });

  const port = options.server?.port || 3000;
  app.listen(port, async () => {
    logger.info(`Combined apps together and run on port ${port}`);
    await config.withApps(config => {
      logger.info(` - ${config.app.name} (frontend) -> /${config.app.name} (${config.client.host})`);
      logger.info(` - ${config.app.name} (backend)  -> /api/v1/${config.app.name} (${config.server.host})`);
    });
  });
};
