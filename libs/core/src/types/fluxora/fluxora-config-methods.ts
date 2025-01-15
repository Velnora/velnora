import type { MicroApp } from "../micro-app";
import type { FluxoraConfig } from "./index";

export interface FluxoraConfigMethods {
  withApps(fn: (config: MicroApp) => void | Promise<void>): Promise<void>;
  getRawConfig(): FluxoraConfig;
}
