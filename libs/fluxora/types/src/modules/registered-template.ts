import type { UserTemplateConfig } from "../user-config";
import type { AppType } from "./app-type";
import type { RegisteredModuleBase } from "./registered-module-base";

export interface RegisteredTemplate extends RegisteredModuleBase<UserTemplateConfig> {
  type: AppType.TEMPLATE;
}
