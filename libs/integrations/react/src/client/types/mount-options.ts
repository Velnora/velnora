import type { FrontendRoute, FrontendSsrRoute } from "@velnora/types";

export interface MountOptions {
  mode: (FrontendRoute | FrontendSsrRoute)["renderMode"];
  selector?: string | Element | Document;
}
