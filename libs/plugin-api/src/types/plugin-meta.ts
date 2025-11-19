export interface PluginMeta {
  /** For visibility & ordering constraints. */
  name: string;

  /**
   * Optional phase preference:
   * - "pre"  : run early (e.g., graph shaping, config injection)
   * - "post" : run late  (e.g., asset emission, reporting)
   */
  enforce?: "pre" | "post";

  /**
   * Optional dependency hints:
   * - run after these plugins (soft): useful to stabilize transform order.
   * - run before these plugins (soft).
   */
  after?: string[];
  before?: string[];

  /**
   * State which adapters/targets this plugin is designed for.
   * If omitted, plugin is considered universal.
   */
  targets?: string[]; // e.g., ["react-dom", "ratatui"]

  /**
   * Optional semver-like version string (for cache keys & diagnostics).
   */
  version?: string;
}
