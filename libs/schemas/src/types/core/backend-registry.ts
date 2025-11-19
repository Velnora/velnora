import type { Package } from "../package";
import type { BackendTarget } from "./backend-target";

export interface BackendRegistry {
  register(name: string, target: BackendTarget): void;
  use(app: Package, runtime: string): void;

  list(): BackendTarget[];
  forApp(appName: string): BackendTarget;
}
