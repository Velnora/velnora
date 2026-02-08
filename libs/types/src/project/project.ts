import type { ProjectConfig } from "./project-config";

export interface Project {
  /**
   * The resolved name of the project.
   * Derived from `project.json` / `package.json` or inferred from the directory name.
   */
  name: string;

  /**
   * The absolute file system path to the project's root directory.
   * Used as the working directory for executing project-specific commands.
   */
  root: string;

  /**
   * The parsed configuration object for the project.
   * Contains metadata like name, type, and custom options.
   */
  config: ProjectConfig;

  /**
   * The absolute path to the configuration file that defined this project.
   * This will be `package.json`.
   */
  configFile: string;
}
