import type { PartialDeep } from "type-fest";

import { Fluxora } from "../namespace";
import type { Adapter } from "./adapter";
import type { Entry } from "./entry";
import type { EnvironmentConfig } from "./environment.config";
import type { Framework } from "./framework";

/**
 * Configuration for a single Fluxora application.
 *
 * Defines how the app is structured, rendered, and exposed
 * in both development and production environments.
 */
export interface UserAppConfig extends Fluxora.UserAppConfig {
  /**
   * Public path to the remote entry file used for module federation.
   *
   * This is a relative path (e.g. `/assets/remoteEntry.js`) that will be
   * combined with the app’s host to resolve the full remote URL.
   *
   * @example "/assets/remoteEntry.js"
   */
  remoteEntryPath: string;

  /**
   * The path for application entry points.
   */
  entry: Entry;

  /**
   * Public host URL of the application, used in production.
   *
   * Ignored in development, where each app runs on its own local server.
   *
   * @example "https://blog.example.com"
   */
  host: string;

  /**
   * Name of the HTML template used to render this app.
   *
   * This refers to a template defined in your templates directory,
   * and controls the base HTML shell used for SSR or hydration.
   *
   * If not specified, a default will be selected at runtime.
   *
   * @example "default"
   */
  template: string;

  /**
   * The frontend framework used by this app.
   *
   * Determines how the app is rendered and which framework adapter is applied.
   *
   * @example "react"
   */
  framework: Framework;

  /**
   * The backend adapter used to host and serve the app.
   *
   * Used to attach middleware, SSR handlers, and routing logic.
   *
   * @example "express"
   */
  adapter: Adapter;

  /**
   * Optional runtime environment config.
   *
   * Currently only "node" is supported. Version constraints can be used
   * to enforce compatibility or target specific Node versions.
   *
   * @example { runtime: "node", runtimeVersion: ">=18.0.0" }
   */
  environment: EnvironmentConfig;

  /**
   * Is framework ssr enabled?
   */
  ssr: boolean;
}

/**
 * Deeply partial version of `UserAppConfig`.
 *
 * Useful for merging configs or supplying overrides.
 */
export type PartialUserAppConfig = PartialDeep<UserAppConfig>;
