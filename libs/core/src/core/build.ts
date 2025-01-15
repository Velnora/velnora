import { createBuilder } from "vite";

import { FluxoraConfigBuilder } from "../utils/fluxora-config.builder";
import { logger } from "../utils/logger";
import { resolveUserConfig } from "../utils/resolve-user-config";
import { getServerConfiguration } from "./configuration/server";

export const build = async () => {
  const userConfig = await resolveUserConfig();
  const fluxoraConfig = await new FluxoraConfigBuilder(userConfig).resolveApps().build();

  await fluxoraConfig.configureApps(configBuilder => {
    configBuilder.assignHost().retrieveViteConfigFile();
  });

  await fluxoraConfig.withApps(async config => {
    const viteConfig = getServerConfiguration(config);
    const startTime = performance.now();
    const builder = await createBuilder(viteConfig);
    await builder.buildApp();
    const diff = (performance.now() - startTime).toFixed(2);
    logger.info(`Backend for ${config.app.name} built in ${diff}ms`);
  });
};
