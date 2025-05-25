import type { IncomingMessage, ServerResponse } from "node:http";

import type { Promisable } from "type-fest";

import type { PartialVelnoraAdapter, VelnoraAdapter } from "@velnora/types";

export const defineAdapter = async <
  TInstance extends (req: IncomingMessage, res: ServerResponse) => void | Promise<void> = any
>(
  adapter: PartialVelnoraAdapter<TInstance> | (() => Promisable<PartialVelnoraAdapter<TInstance>>)
) => (typeof adapter === "function" ? adapter() : adapter) as Promise<VelnoraAdapter<TInstance>>;
