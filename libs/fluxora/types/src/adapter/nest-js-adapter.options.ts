import { AbstractHttpAdapter } from "@nestjs/core";

import type { InternalAdapterServer } from "./adapter-server";

export interface NestJsAdapterOptions<TInstance = any> {
  adapter: AbstractHttpAdapter | ((this: InternalAdapterServer<TInstance>) => AbstractHttpAdapter);
}
