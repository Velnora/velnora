import type { CreateServerOptions } from "@fluxora/types/core";
import { checkAndGenerateGitignore, getFluxoraConfig } from "@fluxora/utils";

import { viteWorkerManager } from "../utils/vite-worker-manager";
import { viteWorkerPath } from "../utils/vite-worker-path";

export const createDevServer = async (options?: CreateServerOptions) => {
  const config = await getFluxoraConfig(options);

  checkAndGenerateGitignore(config);

  await config.withApps(async microApp => {
    await viteWorkerManager.register(microApp.name, viteWorkerPath);

    const proxy = await viteWorkerManager.proxy(microApp.name);
    await proxy.createViteServer(microApp, config.getRawConfig());
    await proxy.serve();

    // Mapping ->
    // - /{app-name} -> http://localhost:{port}
    // - /api/v1/{app-name} -> http://localhost:{port}/api/v1/{app-name}
  });

  // logger.info(`Combined apps together and run on port ${config.server.port}`);
  // await config.withApps(app => {
  //   logger.info(` - ${app.name} bound to \`/${app.name}\` (${app.host.host})`);
  //  // if (app.host.devWsPort) logger.info(` - ${app.name} (hmr) -> ws://localhost:${app.host.devWsPort}/hmr`);
  // });
};
