import { Velnora } from "../namespace";
import type { ProjectSettings } from "./project-settings";

export interface LibrarySettings extends ProjectSettings, Velnora.LibrarySettings {
  /**
   * Specify the directory where the projects will be created.
   * @default "libs"
   */
  root: string;
}
