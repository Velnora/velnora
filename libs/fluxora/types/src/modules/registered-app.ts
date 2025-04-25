import type { UserAppConfig } from "../user-config";
import type { AppType } from "./app-type";
import type { RegisteredModuleBase } from "./registered-module-base";

export interface RegisteredApp extends RegisteredModuleBase<UserAppConfig> {
  type: AppType.APPLICATION;
}
