import type { CreateServerOptions } from "../create-server-options";
import type { MicroApp } from "../micro-app";

export type FluxoraRoot = string & {};

export interface FluxoraConfig {
  apps: MicroApp[];
  server?: CreateServerOptions;
  fluxoraRoot: FluxoraRoot;
  outDirRoot: string;
}

export interface FluxoraRawConfig extends FluxoraConfig {
  __raw: true;
}
