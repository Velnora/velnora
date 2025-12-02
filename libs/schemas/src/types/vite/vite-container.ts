import type { UserConfig } from "vite";

import type { ViteApi } from "../context";
import type { Package } from "../package";

export interface ViteContainer {
  /** Whether the final Vite config has already been built/consumed */
  readonly isUsed: boolean;

  /** Virtual modules that will be injected into Vite */
  readonly virtualModules: Map<string, string>;

  /** The current (merged) Vite user config */
  readonly userConfig: UserConfig;

  /**
   * Update the internal Vite config.
   * - Either pass a partial config
   * - Or a function that receives the current config and returns a partial
   */
  updateConfig(update: Partial<UserConfig> | ((current: UserConfig) => Partial<UserConfig>)): void;

  /**
   * Create a Vite instance for a given app/package.
   */
  withApp(pkg: Package): ViteApi;

  /**
   * Finalize and return the Vite configuration.
   * After this is called once, further modifications are not allowed.
   */
  build(): UserConfig;
}
