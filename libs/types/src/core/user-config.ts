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
   * @default "vite.config.[jt]s"
   */
  configFile?: string;
}

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

export interface CacheSettings {
  /**
   * Specifies the path to the cache directory.
   * The path is relative to the project root.
   *
   * @type {string}
   * @default ".fluxora"
   */
  root?: string;
}

export interface UserConfig {
  /**
   * Apps configuration
   */
  apps?: ApplicationSettings;

  /**
   * Libs configuration
   */
  libs?: LibrarySettings;

  /**
   * Specifies the settings for the projects.
   */
  configs?: Record<string, UserAppConfig>;

  /**
   * Specifies the settings for the cache.
   */
  cache?: CacheSettings;
}
