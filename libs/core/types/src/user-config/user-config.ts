import type { CreateServerOptions } from "../create-server-options";
import type { Framework } from "../framework";
import type { BuildSettings } from "./build-settings";
import type { CacheSettings } from "./cache-settings";
import type { ProjectStructure } from "./project-structure";

export interface UserConfig {
  /**
   * Specifies the project structure.
   */
  projectStructure?: ProjectStructure;

  /**
   * Server configuration
   */
  server?: CreateServerOptions;

  /**
   * Specifies the settings for build.
   */
  build?: BuildSettings;

  /**
   * Specifies the settings for the cache.
   */
  cache?: CacheSettings;

  /**
   * Specifies the settings for the adapter.
   * @default "express"
   */
  adapter?: "express";

  /**
   * Select frameworks which want to use as primary.
   * If you want to use multiple frameworks, you can pass an array.
   * First framework will be used as primary.
   *
   * @default "react"
   */
  framework?: Framework | Framework[];
}
