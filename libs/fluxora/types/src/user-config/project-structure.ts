import { Fluxora } from "../namespace";
import type { ApplicationSettings } from "./application-settings";
import type { LibrarySettings } from "./library-settings";
import type { TemplateSettings } from "./template-settings";

export interface ProjectStructure extends Fluxora.ProjectStructure {
  /**
   * AppsContext configuration
   */
  apps: ApplicationSettings;

  /**
   * Libs configuration
   */
  libs: LibrarySettings;

  /**
   * Template configuration
   */
  template: TemplateSettings;
}
