import type { MicroApp } from "../micro-app";
import type { UserConfig } from "../user-config";
import type { TemplateOptions } from "./template-options";

export interface FluxoraConfig {
  apps: MicroApp[];
  resolvedUserConfig: UserConfig;
  template?: TemplateOptions;
  cacheRoot?: string;
}
