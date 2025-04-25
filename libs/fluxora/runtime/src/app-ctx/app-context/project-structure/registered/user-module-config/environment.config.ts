import type { EnvironmentConfig as IEnvironmentConfig } from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../../../../base-class";

@ClassRawValues()
@ClassExtensions()
export class EnvironmentConfig extends BaseClass implements IEnvironmentConfig {
  @ClassGetterSetter("node")
  declare runtime: IEnvironmentConfig["runtime"];

  @ClassGetterSetter(process.versions.node)
  declare runtimeVersion: string;

  toString() {
    const name = this.runtime;
    const version = this.runtimeVersion;
    return version ? `${name}@${version}` : name;
  }
}
