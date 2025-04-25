import type { Promisable } from "type-fest";

import type { TemplateRenderContext } from "./template-render.context";

export interface TemplateOptions {
  render(ctx: TemplateRenderContext): Promisable<string>;
}
