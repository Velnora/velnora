import type { MicroApp } from "../micro-app";
import type { Name, Path } from "../unions";
import type { AppClient } from "./app-client";
import type { AppServer } from "./app-server";
import type { AppViteConfig } from "./app-vite-config";
import type { FluxoraConfig } from "./fluxora-config";
import type { RemoteEntry } from "./remote-entry";

export interface FluxoraAppConfig extends FluxoraConfig {
  app: MicroApp;
  client: AppClient;
  server: AppServer;
  vite: AppViteConfig;
  remoteEntry: RemoteEntry;
  exposedModules: Map<Path, Name>;
}
