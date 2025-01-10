import type { FluxoraAppConfigBuilder } from "../../utils/fluxora-app-config.builder";
import type { MicroApp } from "../micro-app";
import type { FluxoraApp } from "./index";

export interface FluxoraConfigMethods {
  getAppConfig(app: MicroApp): Promise<FluxoraAppConfigBuilder>;
  configureApps(fn: (config: FluxoraAppConfigBuilder) => void): Promise<void>;
  withApps(fn: (config: FluxoraApp) => void | Promise<void>): Promise<void>;
}
