import type { Package } from "../package";
import type { RoutingSide } from "./routing-side";

export interface RoutingBase {
  id: string;

  /** Which app this route belongs to (from your ModuleGraph) */
  app: Package;

  /** URL prefix this route owns, e.g. "/", "/admin", "/api/web" */
  path: string;

  /** "frontend" or "backend" */
  side: RoutingSide;

  /** Vite env that executes this backend (e.g. "web_server") */
  environment: string;

  /** Entry module id (virtual or real) to import in that env */
  entry: string;
}
