import { Fluxora } from "../namespace";
import type { ProjectSettings } from "./project-settings";

export interface LibrarySettings extends ProjectSettings, Fluxora.LibrarySettings {
  /**
   * Specify the directory where the projects will be created.
   * @default "libs"
   */
  dir: string;
}
