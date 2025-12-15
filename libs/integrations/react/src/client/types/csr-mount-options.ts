import type { FrontendRoute } from "@velnora/types";

export interface CsrMountOptions {
  mode: FrontendRoute["renderMode"];
  selector: string;
}
