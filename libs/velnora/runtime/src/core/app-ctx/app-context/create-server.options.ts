import type { ProxyOptions } from "vite";

import type { CreateServerOptions as ICreateServerOptions } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../base-class";

@ClassRawValues()
@ClassExtensions()
export class CreateServerOptions extends BaseClass implements ICreateServerOptions {
  @ClassGetterSetter("0.0.0.0")
  declare host: string;

  @ClassGetterSetter(3000)
  declare port: number;

  @ClassGetterSetter({})
  declare proxy: Record<string, ProxyOptions>;

  private _internalPortCounter: number | undefined;

  async nextAvailablePort() {
    if (!this._internalPortCounter) this._internalPortCounter = this.port;
    return this._internalPortCounter++;
  }
}
