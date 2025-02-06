import chalk from "chalk";

import { appManager } from "@fluxora/common";
import type { CreateServerOptions } from "@fluxora/types/core";

import { logger } from "../utils/logger";
import { viteWorkerManager } from "../utils/vite-worker-manager";

export const createDevServer = async (options?: CreateServerOptions) => {
  await appManager.resolvePkgJson();

  // const template = appManager.registerTemplate("template");
  // await template.resolveUserConfig();
  //
  // logger.info(`Compiling template`);
  // await template.build();
  // logger.info(chalk.green`Template compiled successfully`);
  // logger.info(chalk.green`Watching installed for template changes...`);
  //
  // const templateViteConfig = await getTemplateConfiguration();
  // await dotFluxoraContentGenerator(config);
  // await config.withApps(async microApp => {
  //   const proxy = await viteWorkerManager.new(microApp.name);
  // await proxy.createViteServer(microApp, config.getRawConfig()).catch(console.error);
  // await proxy.serve().catch(console.error);
  // Mapping ->
  // - /{app-name} -> http://localhost:{port}
  // - /api/v1/{app-name} -> http://localhost:{port}/api/v1/{app-name}
  // });
  // await config.withApps(async microApp => {
  //   const conf = await getFluxoraAppConfig(microApp, config);
  // await dotFluxoraContentGenerator.postScripting(conf);
  // });
  // logger.info(`Combined apps together and run on port ${config.server.port}`);
  // await config.withApps(app => {
  //   logger.info(` - ${app.name} bound to \`/${app.name}\` (${app.host.host})`);
  //  // if (app.host.devWsPort) logger.info(` - ${app.name} (hmr) -> ws://localhost:${app.host.devWsPort}/hmr`);
  // });
};
