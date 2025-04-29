import type { IncomingMessage, ServerResponse } from "node:http";

import type { Connect } from "vite";

type HandleFunction = Connect.NextHandleFunction;

export interface AdapterServer<
  TInstance extends (req: IncomingMessage, res: ServerResponse) => void | Promise<void> = any
> {
  instance(): TInstance;

  use(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  use(this: InternalAdapterServer<TInstance>, ...methods: HandleFunction[]): void;

  get(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  post(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  put(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  patch(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  delete(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
}

export type InternalAdapterServer<
  TInstance extends (req: IncomingMessage, res: ServerResponse) => void | Promise<void> = any
> = Record<"instance", TInstance> & Omit<AdapterServer<TInstance>, "instance">;
