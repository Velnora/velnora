import type { Promisable } from "type-fest";

import type { FluxoraEnvironment } from "@fluxora/types";

export const defineEnvironment = (environment: FluxoraEnvironment | (() => Promisable<FluxoraEnvironment>)) =>
  typeof environment === "function" ? environment() : environment;
