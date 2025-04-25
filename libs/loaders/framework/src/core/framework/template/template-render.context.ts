import type { DevEnvironment, RunnableDevEnvironment, ViteDevServer } from "vite";

import { RegisteredTemplate } from "@fluxora/runtime";
import type { TemplateRenderContext as ITemplateRenderContext } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@fluxora/utils/node";

import { ContainerBaseClass } from "../../container-base-class";
import type { TemplateOptions } from "../template.options";

@ClassExtensions()
export class TemplateRenderContext extends ContainerBaseClass<TemplateOptions> implements ITemplateRenderContext {
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
