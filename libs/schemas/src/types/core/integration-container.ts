import type { Package } from "../package";

export interface IntegrationContainer {
  configure(entry: Package): void;
  scaffold(entry: Package): void;
  build(entry: Package): void;
  runtime(entry: Package): void;
}
