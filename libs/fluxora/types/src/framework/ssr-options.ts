import type { Promisable } from "type-fest";

import type { SSRRenderContext } from "./ssr-render.context";

export interface SSROptions {
  render(ctx: SSRRenderContext): Promisable<string>;
}
