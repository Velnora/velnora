import type { ProjectSettings } from "./project-settings";

export interface TemplateSettings extends ProjectSettings {
  /**
   * Template path where the template files are located.
   * @default "template"
   */
  path?: string;
}
