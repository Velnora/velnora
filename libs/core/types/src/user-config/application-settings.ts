import type { ProjectSettings } from "./project-settings";

export interface ApplicationSettings extends ProjectSettings {
  /**
   * Host application name which will load on "/" route.
   * @default "host"
   */
  hostAppName?: string;

  /**
   * Specify the directory where the projects will be created.
   * Relative to the workspace root.
   *
   * @default "apps"
   */
  dir?: string;
}
