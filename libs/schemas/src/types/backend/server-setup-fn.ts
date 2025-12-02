import type { Promisable } from "type-fest";

import type { ServerHandler } from "./server-handler";
import type { ServerSetupContext } from "./server-setup-context";

export type ServerSetupFn<TModule> = (module: TModule) => (ctx: ServerSetupContext) => Promisable<ServerHandler>;
