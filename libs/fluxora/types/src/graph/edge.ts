import type { NodeId } from "./node-id";

export interface Edge {
  from: NodeId;
  to: NodeId;
  reason: "uses" | "template" | "framework" | "imported";
}
