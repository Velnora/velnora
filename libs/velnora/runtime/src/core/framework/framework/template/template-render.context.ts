import type { DevEnvironment, RunnableDevEnvironment, ViteDevServer } from "vite";

import type { TemplateRenderContext as ITemplateRenderContext } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@velnora/utils/node";

import { RegisteredTemplate } from "../../../app-ctx";
import { BaseClass } from "../../base-class";
import type { TemplateOptions } from "../template.options";

@ClassRawValues()
@ClassExtensions()
export class TemplateRenderContext extends BaseClass<TemplateOptions> implements ITemplateRenderContext {
  @ClassGetterSetter()
  declare template: RegisteredTemplate;

  @ClassGetterSetter()
  declare vite: ViteDevServer;

  @ClassGetterSetter()
  declare client: DevEnvironment;

  @ClassGetterSetter()
  declare server: RunnableDevEnvironment;

  getEntryFile() {
    return findFile(this.template.root, this.template.config.entry, CLIENT_ENTRY_FILE_EXTENSIONS);
  }
}
