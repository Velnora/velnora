import type { DependencyScope } from "./depdendency-scope";

export interface ResolvedDependency {
  name: string;
  version: string;
  scope: DependencyScope;
  children?: ResolvedDependency[];
}
