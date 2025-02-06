import type { CreateServerOptions } from "./create-server-options";

interface ProjectSettings {}

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

export interface BuildSettings {
  /**
   * Specifies the path to the build directory.
   * The path is relative to the project root.
   *
   * @type {string}
   * @default "build"
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
   * Server configuration
   */
  server?: CreateServerOptions;

  /**
   * Specifies the settings for the projects.
   */
  configs?: Record<string, UserAppConfig>;

  /**
   * Specifies the settings for build.
   */
  build?: BuildSettings;

  /**
   * Specifies the settings for the cache.
   */
  cache?: CacheSettings;

  /**
   * Root Application name
   * @default "host"
   */
  hostAppName?: string;
}
