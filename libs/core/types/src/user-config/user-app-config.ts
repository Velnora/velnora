import type { ViteConfigOptions } from "./vite-config-options";

export interface UserAppConfig {
  /**
   * Specifies the path to the remote entry file.
   * The path is relative to the project root.
   *
   * @type {string}
   */
  remoteEntryPath?: string;

  /**
   * Application vite configuration
   */
  vite?: ViteConfigOptions;

  /**
   * Host of the application. Required for production environment.
   * Ignored in development environment.
   */
  host?: string;
}
