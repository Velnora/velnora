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
    const port = await createViteInstance(microApp, config);

    app.use(`/${microApp.name}`, createProxyMiddleware({ target: `http://localhost:${port}` }));
    app.use(
      `/api/v1/${microApp.name}`,
      createProxyMiddleware({
        target: `http://localhost:${port}/api/v1/${microApp.name}`
      })
    );
  });

  const port = options?.port || 3000;
  app.listen(port, async () => {
    logger.info(`Combined apps together and run on port ${port}`);
    await config.withApps(app => {
      logger.info(` - ${app.name} bound to \`/${app.name}\` (${app.host.host})`);
      // if (app.host.devWsPort) logger.info(` - ${app.name} (frontend/hmr) -> ws://localhost:${app.host.devWsPort}/hmr`);
    });
  });
};
