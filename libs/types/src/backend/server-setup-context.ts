import type { LiteralUnion } from "type-fest";

import type { Logger } from "../logger";
import type { Package } from "../package";
import type { BaseRuntimes } from "./base-runtimes";

export interface ServerSetupContext {
  app: Package;
  basePath: string;
  runtime: LiteralUnion<BaseRuntimes, string>;
  logger: Logger;
}
