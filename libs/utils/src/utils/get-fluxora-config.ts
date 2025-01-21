import type { FluxoraConfig } from "@fluxora/types/core";

import { FluxoraConfigBuilder } from "./fluxora-config.builder";
import { resolveUserConfig } from "./resolve-user-config";

export const getFluxoraConfig = async (prevConfig?: FluxoraConfig) => {
  if (prevConfig) {
    return await FluxoraConfigBuilder.from(prevConfig).build();
  }
  const userConfig = await resolveUserConfig();
  return await FluxoraConfigBuilder.from(userConfig)
    .resolveApps()
    .resolveTemplate()
    .resolveCacheOptions()
    .resolveOutputOptions()
    .build();
};
