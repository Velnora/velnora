import type { DependencyScope } from "./depdendency-scope";

export interface Dependency {
  name: string;
  version?: string;
  scope?: DependencyScope;
  registry?: string; // custom registry URL
}
