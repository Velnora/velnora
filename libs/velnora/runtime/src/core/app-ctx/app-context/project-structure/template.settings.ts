import { readdir } from "node:fs/promises";
import { basename, relative, resolve } from "node:path";

import { glob } from "glob";

import {
  AppType,
  type RegisteredTemplate as IRegisteredTemplate,
  type TemplateSettings as ITemplateSettings
} from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { ProjectSettings } from "./project.settings";
import { RegisteredTemplate } from "./registered-template";

@ClassRawValues()
@ClassExtensions()
export class TemplateSettings extends ProjectSettings implements ITemplateSettings {
  @ClassGetterSetter("template", resolve)
  declare root: string;

  @ClassGetterSetter()
  declare templates: Map<string, RegisteredTemplate>;

  @ClassGetterSetter()
  declare registeredTemplate: RegisteredTemplate;

  get rawRoot() {
    return relative(process.cwd(), this.root);
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

  async loadTemplate() {
    const templatePossibleRoot = this.root;
    const templatePkgJson = glob.sync(`package.json`, { cwd: templatePossibleRoot, absolute: true });

    if (templatePkgJson.length) {
      await this.appCtx.projectStructure.loadModule({
        type: AppType.TEMPLATE,
        name: basename(templatePossibleRoot),
        root: templatePossibleRoot,
        config: {}
      });
      return;
    }

    const templates = await readdir(this.root);
    const templatePromises = templates.map(template =>
      this.appCtx.projectStructure.loadModule({
        type: AppType.TEMPLATE,
        name: template,
        root: resolve(this.root, template),
        config: {}
      })
    );
    await Array.fromAsync(templatePromises);
  }

  *[Symbol.iterator]() {
    yield* this.templates.values();
  }
}
