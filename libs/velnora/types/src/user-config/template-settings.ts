import { Velnora } from "../namespace";
import type { ProjectSettings } from "./project-settings";

export interface TemplateSettings extends ProjectSettings, Velnora.TemplateSettings {
  /**
   * Template path where the template files are located.
   * @default "template"
   */
  dir: string;
}
