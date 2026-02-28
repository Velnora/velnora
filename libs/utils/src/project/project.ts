/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

import type { PackageJson } from "type-fest";

import type { Project as IProject, ProjectOptions, VelnoraAppConfig } from "@velnora/types";

/**
 * Represents a discovered project within the Velnora workspace.
 *
 * Provides readonly access to project metadata (name, root, config)
 * and derives computed properties like `displayName` and `path`
 * from the underlying `package.json`.
 */
export class Project implements IProject {
  private readonly _name: string;
  private readonly _root: string;
  private readonly _packageJson: PackageJson;
  private readonly _config: VelnoraAppConfig;

  constructor(options: ProjectOptions) {
    this._name = options.name;
    this._root = options.root;
    this._packageJson = options.packageJson;
    this._config = options.config;
  }

  /** Stable, path-based identifier relative to the workspace root. */
  get name() {
    return this._name;
  }

  /**
   * Human-readable label derived from `package.json#name`.
   *
   * Preserves the author's intended branding (including npm scopes).
   */
  get displayName() {
    return this.packageJson.name!;
  }

  /** Absolute path to the project's root directory. */
  get root() {
    return this._root;
  }

  /** Route to the project */
  get path() {
    return `/${this.packageJson.name}`;
  }

  /** The full, parsed contents of the project's `package.json`. */
  get packageJson() {
    return this._packageJson;
  }

  /** Resolved Velnora configuration (from `velnora.config.*`, or `{}`). */
  get config() {
    return this._config;
  }
}
