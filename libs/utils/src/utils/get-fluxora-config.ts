import type { CreateServerOptions, FluxoraConfig, FluxoraConfigMethods } from "@fluxora/types/core";

import { FluxoraConfigBuilder } from "./fluxora-config.builder";
import { resolveUserConfig } from "./resolve-user-config";

export function getFluxoraConfig(prevConfig: FluxoraConfig): Promise<FluxoraConfig & FluxoraConfigMethods>;
export function getFluxoraConfig(serverOptions?: CreateServerOptions): Promise<FluxoraConfig & FluxoraConfigMethods>;
export function getFluxoraConfig(): Promise<FluxoraConfig & FluxoraConfigMethods>;
export async function getFluxoraConfig(prevConfigOrServerOptions?: FluxoraConfig | CreateServerOptions) {
  if (prevConfigOrServerOptions && "cacheRoot" in prevConfigOrServerOptions) {
    return await FluxoraConfigBuilder.from(prevConfigOrServerOptions).build();
  }

  const serverOptions = prevConfigOrServerOptions;
  const userConfig = await resolveUserConfig();
  return await FluxoraConfigBuilder.from(userConfig, serverOptions)
    .resolveApps()
    .resolveTemplate()
    .resolveCacheOptions()
    .resolveOutputOptions()
    .build();
}
