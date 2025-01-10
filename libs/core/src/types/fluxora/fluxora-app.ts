import type { FluxoraAppConfig } from "./fluxora-app-config";
import type { FluxoraAppConfigMethods } from "./fluxora-app-config-methods";
import type { FluxoraConfigMethods } from "./fluxora-config-methods";

export type FluxoraApp = FluxoraConfigMethods & FluxoraAppConfig & FluxoraAppConfigMethods;
