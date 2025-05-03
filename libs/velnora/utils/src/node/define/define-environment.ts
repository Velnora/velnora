import type { Promisable } from "type-fest";

import type { VelnoraEnvironment } from "@velnora/types";

export const defineEnvironment = (environment: VelnoraEnvironment | (() => Promisable<VelnoraEnvironment>)) =>
  typeof environment === "function" ? environment() : environment;
