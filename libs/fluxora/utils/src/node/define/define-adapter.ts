import type { Promisable } from "type-fest";

import type { PartialFluxoraAdapter } from "@fluxora/types";

export const defineAdapter = async <TInstance>(
  adapter: PartialFluxoraAdapter<TInstance> | (() => Promisable<PartialFluxoraAdapter<TInstance>>)
) => (typeof adapter === "function" ? adapter() : adapter);
