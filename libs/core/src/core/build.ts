import { createBuilder } from "vite";

import { generateDotFluxoraExtraFiles, getFluxoraAppConfig, getFluxoraConfig } from "@fluxora/utils";
import { getAppConfiguration } from "@fluxora/vite";

export const build = async () => {
  const fluxoraConfig = await getFluxoraConfig();
  generateDotFluxoraExtraFiles(fluxoraConfig);

  await fluxoraConfig.withApps(async app => {
    const config = await getFluxoraAppConfig(app, fluxoraConfig);
    const viteConfig = await getAppConfiguration(config);
    const builder = await createBuilder(viteConfig);
    await builder.buildApp();
  });
};
