import type { IncomingMessage, ServerResponse } from "node:http";

import type { AdapterServer } from "./adapter-server";
import type { NestJsAdapterOptions } from "./nest-js-adapter.options";
import type { ViteAdapterOptions } from "./vite-adapter.options";

export interface VelnoraAdapter<
  TInstance extends (req: IncomingMessage, res: ServerResponse) => void | Promise<void> = any
> {
  name: string;

  nestjs: NestJsAdapterOptions<TInstance>;
  vite: ViteAdapterOptions;
  server: AdapterServer<TInstance>;
}

export interface PartialVelnoraAdapter<
  TInstance extends (req: IncomingMessage, res: ServerResponse) => void | Promise<void> = any
> extends Pick<VelnoraAdapter<TInstance>, "name" | "server">,
    Partial<Omit<VelnoraAdapter<TInstance>, "name" | "server" | "vite">> {
  vite?: Partial<ViteAdapterOptions>;
}
