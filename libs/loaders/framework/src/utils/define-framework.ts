import type { Promisable } from "type-fest";

import type { FluxoraFramework } from "@fluxora/types";

export const defineFramework = (framework: Promisable<FluxoraFramework> | (() => Promisable<FluxoraFramework>)) =>
  typeof framework === "function" ? framework() : framework;
