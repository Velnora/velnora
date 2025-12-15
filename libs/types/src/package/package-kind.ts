/**
 * Represents the classification of a workspace package based on its structure and purpose.
 * Determines how the package integrates into the system.
 */
export enum PackageKind {
  /**
   * **Application**
   *
   * Has both `client/` and `server/` directories alongside `package.json`.
   * Full-stack units combining frontend and backend layers.
   */
  App = "app",

  /**
   * **Library**
   *
   * Identified by presence of `main`, `module`, or `exports` in `package.json`
   * and a `src/main.ts` entry file.
   * Reusable, framework-agnostic code shared across multiple packages.
   */
  Lib = "lib",

  /**
   * **Module**
   *
   * Contains a `client/` directory only (no `server/`).
   * Represents frontend-only logic — e.g., standalone UI module, SPA shell,
   * or remote microfrontend intended to consume backend services.
   */
  Module = "module",

  /**
   * **Service**
   *
   * Contains a `server/` directory only (no `client/`).
   * Usually represents a backend service or microservice exposing APIs or events.
   */
  Service = "service",

  /**
   * **Unknown**
   *
   * Fallback classification for packages that don't match any known structure.
   * Used when automatic detection fails or for experimental/untyped packages.
   */
  Unknown = "unknown"
}
