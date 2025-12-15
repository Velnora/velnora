import type { Package } from "../package";

export interface IntegrationContainerHooks {
  "integration:configure"(entry: Package): Promise<void>;
  "integration:scaffold"(entry: Package): Promise<void>;
  "integration:build"(entry: Package): Promise<void>;
  "integration:runtime"(entry: Package): Promise<void>;
}
