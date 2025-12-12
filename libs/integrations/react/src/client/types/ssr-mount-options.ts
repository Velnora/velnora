import type { FrontendSsrRoute } from "@velnora/schemas";

export interface SsrMountOptions {
  mode: FrontendSsrRoute["renderMode"];
  selector?: string;
}
