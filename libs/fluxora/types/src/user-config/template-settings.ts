import { Fluxora } from "../namespace";
import type { ProjectSettings } from "./project-settings";

export interface TemplateSettings extends ProjectSettings, Fluxora.TemplateSettings {
  /**
   * Template path where the template files are located.
   * @default "template"
   */
  dir: string;
}
