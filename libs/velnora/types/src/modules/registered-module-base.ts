import type { AppType } from "./app-type";

export interface RegisteredModuleBase<TConfig = {}> {
  type: AppType;
  name: string;
  root: string;
  config: TConfig;
}
