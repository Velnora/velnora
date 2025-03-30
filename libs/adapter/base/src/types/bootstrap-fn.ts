import type { Promisable } from "type-fest";

import { HttpAdapterBase } from "../core/http-adapter-base";
import type { BootstrapFnOptions } from "./bootstrap-fn-options";

export interface BootstrapFn {
  (options: BootstrapFnOptions): Promisable<HttpAdapterBase>;
}
