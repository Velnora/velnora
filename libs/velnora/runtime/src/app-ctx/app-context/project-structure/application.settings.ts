import { relative, resolve } from "node:path";

import type { ApplicationSettings as IApplicationSettings, RegisteredApp as IRegisteredApp } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { ProjectSettings } from "./project.settings";
import { RegisteredApp } from "./registered-app";

@ClassRawValues()
@ClassExtensions()
export class ApplicationSettings extends ProjectSettings implements IApplicationSettings {
  @ClassGetterSetter()
  declare hostAppName: string;

  @ClassGetterSetter("apps", resolve)
  declare root: string;

  @ClassGetterSetter()
  declare apps: Map<string, RegisteredApp>;

  @ClassGetterSetter()
  declare registeredApp: RegisteredApp;

  get rawRoot() {
    return relative(process.cwd(), this.root);
  }

  register(app: IRegisteredApp) {
    if (this.apps.has(app.name)) {
      throw new Error(`App ${app.name} already exists`);
    }
    const registeredApp = new RegisteredApp(this.appCtx);
    Object.assign(registeredApp, app);
    this.apps.set(app.name, registeredApp);
    return registeredApp;
  }

  getModule(name: string) {
    const app = this.apps.get(name);
    if (!app) {
      throw new Error(`App ${name} not found`);
    }
    return app;
  }

  *[Symbol.iterator]() {
    yield* this.apps.values();
  }
}
