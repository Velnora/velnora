import type { MicroApp } from "../micro-app";
import type { ResolvedUserConfig } from "../resolved-user-config";
import type { TemplateOptions } from "./template-options";

export interface FluxoraConfig {
  apps: MicroApp[];
  resolvedUserConfig: ResolvedUserConfig;
  template?: TemplateOptions;
}
