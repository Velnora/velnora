import { AppType } from "../modules";
import type { NodeId } from "./node-id";

export interface Node<TMeta = Record<string, any>> {
  id: NodeId;
  name?: string;
  type: AppType;
  meta?: TMeta;
}
