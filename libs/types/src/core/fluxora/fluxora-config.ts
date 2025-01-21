import type { CreateServerOptions } from "../create-server-options";
import type { MicroApp } from "../micro-app";
import type { UserConfig } from "../user-config";
import type { TemplateOptions } from "./template-options";

export interface FluxoraConfig {
  apps: MicroApp[];
  resolvedUserConfig: UserConfig;
  server?: CreateServerOptions;
  template?: TemplateOptions;
  cacheRoot: string;
  outDirRoot: string;
}

export interface FluxoraRawConfig extends FluxoraConfig {
  __raw: true;
}
