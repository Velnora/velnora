interface ProjectSettings {
  /**
   * Specifies the root directory of the project.
   * Supports glob patterns for flexible matching.
   * The path is relative to the project root.
   *
   * @type {string}
   * @default "apps"
   */
  root?: string;
}

interface LibrarySettings extends ProjectSettings {}

interface ApplicationSettings extends ProjectSettings {}

interface ViteConfigOptions {
  /**
   * Specifies the path to the Vite configuration file.
   * The path is relative to the project root.
   *
   * @type {string}
   * @default "vite.config.ts"
   */
  configFile?: string;
}

export interface ResolvedUserAppConfig {
  /**
   * Specifies the path to the remote entry file.
   * The path is relative to the project root.
   *
   * @type {string}
   */
  remoteEntryPath?: string;
}

export interface ResolvedUserConfig {
  apps?: ApplicationSettings;
  libs?: LibrarySettings;
  vite?: ViteConfigOptions;
  hosts?: Record<string, string>;
  config?: Record<string, ResolvedUserAppConfig>;
}
