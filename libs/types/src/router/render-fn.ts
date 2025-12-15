import type { Promisable } from "type-fest";

import type { SsrRenderResult } from "./ssr-render-result";
import type { SsrRequestContext } from "./ssr-request-context";

export interface RenderFn {
  (ctx: SsrRequestContext): Promisable<SsrRenderResult>;
}
