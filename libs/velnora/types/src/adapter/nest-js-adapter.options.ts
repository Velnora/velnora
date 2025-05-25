import type { IncomingMessage, ServerResponse } from "node:http";

import { AbstractHttpAdapter } from "@nestjs/core";

import type { InternalAdapterServer } from "./adapter-server";

export interface NestJsAdapterOptions<
  TInstance extends (req: IncomingMessage, res: ServerResponse) => void | Promise<void> = any
> {
  adapter: AbstractHttpAdapter | ((this: InternalAdapterServer<TInstance>) => AbstractHttpAdapter);
}
