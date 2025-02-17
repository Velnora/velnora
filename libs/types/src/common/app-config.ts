import type { Name, Path } from "./unions";

export interface AppConfig {
  name: string;
  componentName: string;
  exposedModules: Record<Path, Name[]>;
}
