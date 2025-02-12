import { appManager } from "@fluxora/common";
import { contentGenerator } from "@fluxora/generator";
import { type CreateServerOptions } from "@fluxora/types/core";

import { workerPool } from "../utils/worker-pool";

export const createDevServer = async (options?: CreateServerOptions) => {
  appManager.init(options);

  await appManager.resolveUserConfig();
  await appManager.resolvePackages();

  // const template = appManager.getTemplateApp();
  // logger.info(`Compiling template`);
  // const root = await compileAndWatch(template);
  // root && (template.root = root);
  // logger.info(chalk.green`Template compiled successfully`);
  // logger.info(chalk.green`Watcher installed for template changes...`);

  const apps = appManager.getApps();

  await contentGenerator();

  for (const app of apps) {
    const worker = workerPool.new(app.name);
    appManager.communicateWithWorkers(worker, workerPool);
    await worker.init();
  }

  for (const app of apps) {
    const worker = workerPool.proxy(app.name);

    await worker.createViteServer(app).catch(console.error);
    await worker.serve().catch(console.error);

    // Mapping ->
    // - /{app-name} -> http://localhost:{port}
    // - /api/v1/{app-name} -> http://localhost:{port}/api/v1/{app-name}
    // });
  }

  // logger.info(`Combined apps together and run on port ${config.server.port}`);
  // await config.withApps(app => {
  //   logger.info(` - ${app.name} bound to \`/${app.name}\` (${app.host.host})`);
  //  // if (app.host.devWsPort) logger.info(` - ${app.name} (hmr) -> ws://localhost:${app.host.devWsPort}/hmr`);
  // });
};
