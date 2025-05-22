import type { Adapter, Framework, UserAppConfig as IUserAppConfig } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../../../base-class";
import { Entry, EnvironmentConfig } from "./user-module-config";

@ClassRawValues()
@ClassExtensions()
export class UserAppConfig extends BaseClass implements IUserAppConfig {
  @ClassGetterSetter("/assets/remoteEntry.js")
  declare remoteEntryPath: string;

  @ClassGetterSetter("0.0.0.0")
  declare host: string;

  @ClassGetterSetter()
  declare template: string;

  @ClassGetterSetter("react")
  declare framework: Framework;

  @ClassGetterSetter("express")
  declare adapter: Adapter;

  @ClassGetterSetter()
  declare environment: EnvironmentConfig;

  @ClassGetterSetter()
  declare entry: Entry;

  @ClassGetterSetter(true)
  declare ssr: boolean;
}
