import type { Package } from "../package";

export interface IntegrationContainer {
  configure(entry: Package): Promise<void>;
  scaffold(entry: Package): Promise<void>;
  build(entry: Package): Promise<void>;
  runtime(entry: Package): Promise<void>;
}
