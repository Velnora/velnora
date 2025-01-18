import type { CreateServerOptions } from "@fluxora/types/core";

import { checkAndGenerateGitignore } from "../utils/check-and-generate-gitignore";
import { createViteInstance } from "../utils/create-vite-instance";
import { FluxoraConfigBuilder } from "../utils/fluxora-config.builder";
import { resolveUserConfig } from "../utils/resolve-user-config";

export const createDevServer = async (_options?: CreateServerOptions) => {
  const userConfig = await resolveUserConfig();
  const config = await FluxoraConfigBuilder.from(userConfig)
    .resolveTemplate()
    .resolveApps()
    .retrieveCacheOptions()
    .build();

  checkAndGenerateGitignore(config);

  await config.withApps(async microApp => {
    await createViteInstance(microApp, config);

    // Mapping ->
    // - /{app-name} -> http://localhost:{port}
    // - /api/v1/{app-name} -> http://localhost:{port}/api/v1/{app-name}
  });

  // logger.info(`Combined apps together and run on port ${port}`);
  // await config.withApps(app => {
  //   logger.info(` - ${app.name} bound to \`/${app.name}\` (${app.host.host})`);
  //  // if (app.host.devWsPort) logger.info(` - ${app.name} (frontend/hmr) -> ws://localhost:${app.host.devWsPort}/hmr`);
  // });
};
