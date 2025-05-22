import { readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";

import {
  AppType,
  type LibrarySettings as ILibrarySettings,
  type RegisteredLib as IRegisteredLib
} from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { ProjectSettings } from "./project.settings";
import { RegisteredLib } from "./registered-lib";

@ClassRawValues()
@ClassExtensions()
export class LibrarySettings extends ProjectSettings implements ILibrarySettings {
  @ClassGetterSetter("libs", resolve)
  declare root: string;

  @ClassGetterSetter()
  declare libs: Map<string, RegisteredLib>;

  @ClassGetterSetter()
  declare registeredLib: RegisteredLib;

  get rawRoot() {
    return relative(process.cwd(), this.root);
  }

  register(module: IRegisteredLib) {
    if (this.libs.has(module.name)) {
      throw new Error(`Library ${module.name} already exists`);
    }
    const registeredLib = new RegisteredLib(this.appCtx);
    Object.assign(registeredLib, module);
    this.libs.set(module.name, registeredLib);
    return registeredLib;
  }

  async loadLibs() {
    const libs = await readdir(this.root);
    const libsPromises = libs.map(lib =>
      this.appCtx.projectStructure.loadModule({
        type: AppType.LIBRARY,
        name: lib,
        root: resolve(this.root, lib),
        config: {}
      })
    );
    await Array.fromAsync(libsPromises);
  }

  *[Symbol.iterator]() {
    yield* this.libs.values();
  }
}
