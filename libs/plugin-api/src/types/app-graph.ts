import type { AppNode } from "./app-node";

export interface AppGraph {
  root: string;
  nodes: AppNode[];
  /** Free-form bag for plugin-produced graph data (routes, manifests, etc.) */
  meta?: Record<string, unknown>;
}
