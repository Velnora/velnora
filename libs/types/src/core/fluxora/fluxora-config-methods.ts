import type { MicroApp } from "../micro-app";
import type { FluxoraRawConfig } from "./index";

export interface FluxoraConfigMethods {
  withApps(fn: (config: MicroApp) => void | Promise<void>): Promise<void>;
  getRawConfig(): FluxoraRawConfig;
}
