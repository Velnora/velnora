import type { Hookable } from "hookable";

import type { VelnoraHooks } from "./velnora.hooks";

export interface VelnoraContext {
  hooks: Hookable<VelnoraHooks>;
}
