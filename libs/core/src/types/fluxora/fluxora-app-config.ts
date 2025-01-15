import type { MicroApp } from "../micro-app";
import type { Name, Path } from "../unions";
import type { AppViteConfig } from "./app-vite-config";
import type { FluxoraConfig } from "./fluxora-config";
import type { RemoteEntry } from "./remote-entry";

export interface FluxoraAppConfig extends FluxoraConfig {
  app: MicroApp;
  vite: AppViteConfig;
  remoteEntry: RemoteEntry;
  exposedModules: Map<Path, Name>;
}
