import { createBuilder } from "vite";

import { getAppConfiguration } from "@fluxora/vite";

import { checkAndGenerateGitignore } from "../utils/check-and-generate-gitignore";
import { FluxoraAppConfigBuilder } from "../utils/fluxora-app-config.builder";
import { FluxoraConfigBuilder } from "../utils/fluxora-config.builder";
import { resolveUserConfig } from "../utils/resolve-user-config";

export const build = async () => {
  const userConfig = await resolveUserConfig();
  const fluxoraConfig = await FluxoraConfigBuilder.from(userConfig)
    .resolveApps()
    .resolveTemplate()
    .resolveCacheOptions()
    .resolveOutputOptions()
    .build();

  checkAndGenerateGitignore(fluxoraConfig);

  await fluxoraConfig.withApps(async app => {
    const config = await (await FluxoraAppConfigBuilder.from(app, fluxoraConfig))
      .setRemoteEntry()
      .retrieveViteConfigFile()
      .build();
    const viteConfig = await getAppConfiguration(config);
    const builder = await createBuilder(viteConfig);
    await builder.buildApp();
  });
};
