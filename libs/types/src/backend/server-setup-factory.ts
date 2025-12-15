import type { Promisable } from "type-fest";

import type { ServerHandler } from "./server-handler";
import type { ServerSetupContext } from "./server-setup-context";

/**
 * The factory that actually boots the backend and returns a handler.
 * `ctx` is optional, so plugin authors can ignore it if they want.
 */
export type ServerSetupFactory<TModule> = (module: TModule, ctx: ServerSetupContext) => Promisable<ServerHandler>;
