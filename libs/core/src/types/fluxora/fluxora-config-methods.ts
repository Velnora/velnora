import type { FluxoraAppConfigBuilder } from "../../utils/fluxora-app-config.builder";
import type { MicroApp } from "../micro-app";
import type { FluxoraApp } from "./index";

export interface FluxoraConfigMethods {
  getAppConfigBuilder(app: MicroApp): Promise<FluxoraAppConfigBuilder>;
  configureApps(fn: (config: FluxoraAppConfigBuilder) => void): Promise<void>;
  getAppConfig(app: MicroApp): Promise<FluxoraApp>;
  withApps(fn: (config: FluxoraApp) => void | Promise<void>): Promise<void>;
}
