import type { PackageJson } from "type-fest";

import type { Node } from "./node";

export interface AppModuleGraph {
  nodes: Set<string>;
  nodeMeta: Map<string, Node>;
  edges: Map<string, Set<string>>;

  addModule(root: string, packageJson: PackageJson): this;
  perNode(callback: (moduleName: string, meta: Node) => Promise<void>): Promise<this>;
  perNode(callback: (moduleName: string, meta: Node) => void): this;

  addDependency(fromModule: string, toModule: string): this;
  getDependencies(moduleName: string): Set<string> | undefined;

  hasModule(moduleName: string): boolean;
  hasDependency(fromModule: string, toModule: string): boolean;

  removeModule(moduleName: string): this;
  removeDependency(fromModule: string, toModule: string): this;
}
