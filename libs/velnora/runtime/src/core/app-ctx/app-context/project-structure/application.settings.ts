import { readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";

import {
  AppType,
  type ApplicationSettings as IApplicationSettings,
  type RegisteredApp as IRegisteredApp
} from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { logger } from "../../../../utils/logger/logger";
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

  async loadApps() {
    const apps = await readdir(this.root);
    const appsPromises = apps.map(app =>
      this.appCtx.projectStructure.loadModule({
        type: AppType.APPLICATION,
        name: app,
        root: resolve(this.root, app),
        config: {}
      })
    );
    await Array.fromAsync(appsPromises);
  }

  getHostApp() {
    if (this.hostAppName) {
      const hostApp = this.apps.get(this.hostAppName);
      if (hostApp) return hostApp;
    }

    if (this.apps.size === 0) {
      throw new Error("No apps found");
    }

    const hostApp = this.apps.values().next().value!;
    const message = this.hostAppName
      ? `Host app "${this.hostAppName}" not found, using "${hostApp.name}" as host app.`
      : `No host app defined, using "${hostApp.name}" as host app.`;

    logger.warn(message);
    this.hostAppName = hostApp.name;
    return hostApp;
  }

  *[Symbol.iterator]() {
    yield* this.apps.values();
  }
}
