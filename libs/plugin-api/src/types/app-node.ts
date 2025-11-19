export interface AppNode {
  id: string; // unique within the graph
  path: string; // fs/virtual path
  type: "layout" | "page" | "head" | "route" | "api";
  parentId?: string; // layout nesting
  meta?: Record<string, unknown>; // arbitrary discovery info
}
