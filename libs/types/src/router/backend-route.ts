import type { LiteralUnion } from "type-fest";

import type { BaseRuntimes } from "../backend/base-runtimes";
import type { RoutingBase } from "./routing-base";

export interface BackendRoute extends RoutingBase {
  side: "backend";

  /** Runtime this route is intended to run in, e.g. "node", "deno", "bun" */
  runtime: LiteralUnion<BaseRuntimes, string>;
}
