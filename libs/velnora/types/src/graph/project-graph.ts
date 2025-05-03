import type { Edge } from "./edge";
import type { Node } from "./node";

export interface ProjectGraph {
  nodes: Node[];
  edges: Edge[];
}
