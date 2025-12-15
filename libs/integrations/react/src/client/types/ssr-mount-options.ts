import type { FrontendSsrRoute } from "@velnora/types";

export interface SsrMountOptions {
  mode: FrontendSsrRoute["renderMode"];
  selector?: string;
}
