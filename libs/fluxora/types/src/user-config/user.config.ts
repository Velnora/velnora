import type { PartialDeep } from "type-fest";

import { Fluxora } from "../namespace";
import type { Adapter } from "./adapter";
import type { BuildSettings } from "./build-settings";
import type { CacheSettings } from "./cache-settings";
import type { CreateServerOptions } from "./create-server-options";
import type { ProjectStructure } from "./project-structure";

export interface UserConfig extends Fluxora.UserConfig {
  /**
   * Specifies the project structure.
   */
  projectStructure: ProjectStructure;

  /**
   * Server configuration
   */
  server: CreateServerOptions;

  /**
   * Specifies the settings for build.
   */
  build: BuildSettings;

  /**
   * Specifies the settings for the cache.
   */
  cache: CacheSettings;

  /**
   * Specifies the settings for the adapter.
   * @default "express"
   */
  adapter: Adapter;
}

export type PartialUserConfig = PartialDeep<UserConfig>;
