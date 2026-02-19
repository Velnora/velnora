import type { DependencyScope } from "./depdendency-scope";

export interface AddOptions {
  scope?: DependencyScope;
  exact?: boolean; // pin exact version
}
