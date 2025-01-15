import type { FluxoraAppConfig, FluxoraConfig } from "@fluxora/core";

export interface WorkerCreateServerData extends Pick<FluxoraAppConfig, "app"> {
  config: FluxoraConfig;
  isClient: boolean;
}
