import type { FluxoraConfig, MicroApp } from "@fluxora/types/core";

import { FluxoraAppConfigBuilder } from "./fluxora-app-config.builder";
import { getFluxoraConfig } from "./get-fluxora-config";

export const getFluxoraAppConfig = async (app: MicroApp, fluxoraConfig?: FluxoraConfig, isBuild = false) => {
  const config = fluxoraConfig ? fluxoraConfig : await getFluxoraConfig();
  const appConfigBuilder = await FluxoraAppConfigBuilder.from(app, config);
  appConfigBuilder.setRemoteEntry().retrieveViteConfigFile();
  appConfigBuilder.checkHostForProduction(isBuild);
  return await appConfigBuilder.build();
};
