import { Velnora } from "../namespace";

/**
 * Defines the runtime environment for an app.
 *
 * This configuration is used to specify which runtime the project
 * is intended to run on and (optionally) enforce version constraints.
 *
 * Currently, only the Node.js runtime is supported.
 */
export interface EnvironmentConfig extends Velnora.EnvironmentConfig {
  /**
   * Target runtime environment.
   *
   * This defines which backend runtime should be used. Only `"node"`
   * is supported at the moment, but this field is designed for future expansion.
   *
   * @example "node"
   */
  runtime: "node";

  /**
   * Optional version constraint for the specified runtime.
   *
   * This uses [semver](https://semver.org/) syntax to restrict
   * which versions of the runtime are allowed for this project.
   *
   * @example ">=18.0.0"
   */
  runtimeVersion: string;
}
