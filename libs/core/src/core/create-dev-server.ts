import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { checkAndGenerateGitignore } from "../utils/check-and-generate-gitignore";
import { createViteInstance } from "../utils/create-vite-instance";
import { FluxoraConfigBuilder } from "../utils/fluxora-config.builder";
import { logger } from "../utils/logger";
import { resolveUserConfig } from "../utils/resolve-user-config";
import type { CreateServerOptions } from "./create-server.types";

export const createDevServer = async (options?: CreateServerOptions) => {
  const userConfig = await resolveUserConfig();
  const config = await FluxoraConfigBuilder.from(userConfig)
    .resolveTemplate()
    .resolveApps()
    .retrieveCacheOptions()
    .build();
  const app = express();

  checkAndGenerateGitignore(config);

  await config.withApps(async microApp => {
    const clientPort = await createViteInstance(microApp, config, true);
    const serverPort = await createViteInstance(microApp, config, false);

    app.use(`/${microApp.name}`, createProxyMiddleware({ target: `http://localhost:${clientPort}` }));
    app.use(
      `/api/v1/${microApp.name}`,
      createProxyMiddleware({
        target: `http://localhost:${serverPort}/api/v1/${microApp.name}`
      })
    );
  });

  // app.all("*", (_req, res) => {
  //   res.json({ done: false });
  // });

  const port = options?.port || 3000;
  // app.listen(port, async () => {
  logger.info(`Combined apps together and run on port ${port}`);
  await config.withApps(app => {
    logger.info(` - ${app.name} (frontend) -> /${app.name} (${app.host.clientHost})`);
    // if (app.host.devWsPort) logger.info(` - ${app.name} (frontend/hmr) -> ws://localhost:${app.host.devWsPort}/hmr`);
    logger.info(` - ${app.name} (backend)  -> /api/v1/${app.name} (${app.host.serverHost})`);
  });
  // });
};
