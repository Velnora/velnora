import type { MicroApp } from "../micro-app";
import type { FluxoraApp } from "./fluxora-app";

export interface FluxoraAppConfigMethods {
  getOtherAppConfig(app: MicroApp): Promise<FluxoraApp | null>;
}
