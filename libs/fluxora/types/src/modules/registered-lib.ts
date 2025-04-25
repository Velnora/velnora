import type { UserLibConfig } from "../user-config";
import type { AppType } from "./app-type";
import type { RegisteredModuleBase } from "./registered-module-base";

export interface RegisteredLib extends RegisteredModuleBase<UserLibConfig> {
  type: AppType.LIBRARY;
}
