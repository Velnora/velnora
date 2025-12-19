import type { Package } from "../package";

export interface ModuleGraph {
  readonly nodes: Package[];

  /** build/load graph for the workspace (cached via persistence) */
  indexWorkspace(): Promise<void> | void;

  /** mutate a node by name or by ref */
  updateNode(node: string | Package, cb: (node: Package) => void): void;

  /** iterate nodes (sync or async) */
  forEach(callback: (module: Package) => Promise<unknown>): Promise<this>;
  forEach(callback: (module: Package) => unknown): this;

  /** map nodes (sync/async) */
  map<TResult>(callback: (module: Package) => TResult | Promise<TResult>): Promise<TResult[]>;
}
