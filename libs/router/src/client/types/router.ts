import type { PathObject } from "./path-object";
import type { PublicRouter } from "./public-router";

export interface Router {
  readonly pathObject: PathObject;

  getPublicInterface(): PublicRouter;
  subscribe(callback: (path: PathObject, previousPath?: PathObject | null) => void): () => void;
}
