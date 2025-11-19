import type { VelnoraAppContext } from "./velnora-app.context";
import type { VelnoraPlugin } from "./velnora-plugin";

export interface BaseMountOptions {
  /** The context with which the runtime/renderer should mount. */
  context: VelnoraAppContext;

  /**
   * Optional list of plugins to apply for this mount.
   * If omitted, the host can supply a default registry.
   */
  plugins?: VelnoraPlugin[];

  /**
   * Optional user config object passed through plugin `config()` hooks.
   * Useful for per-app tuning (theme tokens, guards, feature flags).
   */
  userConfig?: Record<string, unknown>;
}
