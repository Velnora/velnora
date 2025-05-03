import type { Promisable } from "type-fest";

import type { PartialVelnoraAdapter } from "@velnora/types";

export const defineAdapter = async <TInstance>(
  adapter: PartialVelnoraAdapter<TInstance> | (() => Promisable<PartialVelnoraAdapter<TInstance>>)
) => (typeof adapter === "function" ? adapter() : adapter);
