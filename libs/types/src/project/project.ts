import type { PackageJson } from "type-fest";

import type { VelnoraAppConfig } from "../config";

export interface Project {
  /**
   * A stable, path-based identifier for the project within the workspace.
   *
   * Computed as the relative path from the workspace root to the project directory.
   * For example, a project located at `/workspace/packages/app-one` in a workspace
   * rooted at `/workspace` will have the name `packages/app-one`.
   *
   * This value is deterministic and filesystem-derived — it does not depend on
   * anything declared inside `package.json` or `velnora.config.ts`, making it
   * safe to use as a map key, route segment, or cache identifier.
   */
  readonly name: string;

  /**
   * A human-readable label for the project, taken directly from `packageJson.name`.
   *
   * Unlike `name` (which is a path-based ID), `displayName` preserves the
   * author's intended branding — including npm scopes (e.g. `@acme/dashboard`).
   * It is primarily used in CLI output, logs, and the Host dashboard UI.
   *
   * Marked `readonly` because it is derived data; mutating it would create
   * a mismatch with the underlying `packageJson`.
   */
  readonly displayName: string;

  /**
   * The absolute file-system path to the project's root directory.
   *
   * All project-relative operations (building, serving, config resolution)
   * use this path as their working directory. Guaranteed to be an absolute,
   * resolved path with no trailing slash.
   */
  readonly root: string;

  /**
   * The URL path prefix used to route requests to this project.
   *
   * Derived from `packageJson.name` (e.g. `/@acme/dashboard`).
   * The Host registers each project under this path so that
   * incoming requests can be dispatched to the correct app.
   */
  readonly path: string;

  /**
   * The full, parsed contents of the project's `package.json`.
   *
   * Stored as-is so that any consumer (adapters, plugins, CLI commands) can
   * inspect dependencies, scripts, or custom fields without re-reading the file.
   * Typed as `PackageJson` from `type-fest` for broad compatibility.
   */
  readonly packageJson: PackageJson;

  /**
   * The resolved Velnora configuration for this project.
   *
   * Loaded from `velnora.config.ts` (or `.js` / `.json`) at the project root.
   * If no configuration file exists, this defaults to an empty object (`{}`),
   * ensuring that downstream consumers can always access it without null checks.
   *
   * This is the per-project counterpart to the workspace-level `VelnoraConfig`.
   */
  readonly config: VelnoraAppConfig;
}
