import type { Promisable } from "type-fest";

import type { VelnoraFramework } from "@velnora/types";

export const defineFramework = (framework: Promisable<VelnoraFramework> | (() => Promisable<VelnoraFramework>)) =>
  typeof framework === "function" ? framework() : framework;
