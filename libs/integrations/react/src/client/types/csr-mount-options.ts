import type { FrontendRoute } from "@velnora/schemas";

export interface CsrMountOptions {
  mode: FrontendRoute["renderMode"];
  selector: string;
}
