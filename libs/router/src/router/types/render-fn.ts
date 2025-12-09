import type { SsrRenderResult } from "./ssr-render-result";
import type { SsrRequestContext } from "./ssr-request-context";

export interface RenderFn {
  (ctx: SsrRequestContext): Promise<SsrRenderResult>;
}
