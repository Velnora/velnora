import { createBuilder } from "vite";

import { FluxoraAppConfigBuilder } from "../utils/fluxora-app-config.builder";
import { FluxoraConfigBuilder } from "../utils/fluxora-config.builder";
import { logger } from "../utils/logger";
import { resolveUserConfig } from "../utils/resolve-user-config";
import { getServerConfiguration } from "./configuration/server";

export const build = async () => {
  const userConfig = await resolveUserConfig();
  const fluxoraConfig = await FluxoraConfigBuilder.from(userConfig).resolveApps().build();

  await fluxoraConfig.withApps(async app => {
    // const config = await (await FluxoraAppConfigBuilder.from(app, fluxoraConfig)).retrieveViteConfigFile().build();
    // const viteConfig = getServerConfiguration(config);
    // const startTime = performance.now();
    // const builder = await createBuilder(viteConfig);
    // await builder.buildApp();
    // const diff = (performance.now() - startTime).toFixed(2);
    // logger.info(`Backend for ${config.app.name} built in ${diff}ms`);
  });
};
