import type { ProjectSettings } from "./project-settings";

export interface LibrarySettings extends ProjectSettings {
  /**
   * Specify the directory where the projects will be created.
   * @default "libs"
   */
  dir?: string;
}
