import { resolve } from "node:path";

import type { LibrarySettings as ILibrarySettings, RegisteredLib as IRegisteredLib } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { ProjectSettings } from "./project.settings";
import { RegisteredLib } from "./registered-lib";

@ClassRawValues()
@ClassExtensions()
export class LibrarySettings extends ProjectSettings implements ILibrarySettings {
  @ClassGetterSetter("libs", resolve)
  declare dir: string;

  @ClassGetterSetter()
  declare libs: Map<string, RegisteredLib>;

  @ClassGetterSetter()
  declare registeredLib: RegisteredLib;

  *[Symbol.iterator]() {
    yield* this.libs.values();
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
}
