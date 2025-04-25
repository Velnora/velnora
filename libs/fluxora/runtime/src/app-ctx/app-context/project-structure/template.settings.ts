import { resolve } from "node:path";

import type { RegisteredTemplate as IRegisteredTemplate, TemplateSettings as ITemplateSettings } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { ProjectSettings } from "./project.settings";
import { RegisteredTemplate } from "./registered-template";

@ClassExtensions()
export class TemplateSettings extends ProjectSettings implements ITemplateSettings {
  @ClassGetterSetter("template", resolve)
  declare dir: string;

  @ClassGetterSetter()
  declare templates: Map<string, RegisteredTemplate>;

  @ClassGetterSetter()
  declare registeredTemplate: RegisteredTemplate;

  *[Symbol.iterator]() {
    yield* this.templates.values();
  }

  register(template: IRegisteredTemplate) {
    if (this.templates.has(template.name)) {
      throw new Error(`Template ${template.name} already exists`);
    }
    const registeredTemplate = new RegisteredTemplate(this.appCtx);
    this.templates.set(template.name, registeredTemplate);
    Object.assign(registeredTemplate, template);
    return registeredTemplate;
  }

  getModule(template: string) {
    const module = this.templates.get(template)!;
    if (!module && this.templates.size > 1) {
      throw new Error(`Template ${template} not found`);
    } else if (this.templates.size === 1) {
      return this.templates.values().next().value!;
    }
    return module;
  }
}
