import type { FrontendSSrRoute } from "@velnora/schemas";

export interface SsrMountOptions {
  mode: FrontendSSrRoute["renderMode"];
}
