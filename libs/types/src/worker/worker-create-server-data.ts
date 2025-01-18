import type { FluxoraAppConfig, FluxoraConfig } from "../core/main";

export interface WorkerCreateServerData extends Pick<FluxoraAppConfig, "app"> {
  config: FluxoraConfig;
}
