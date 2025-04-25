import type { IncomingMessage, ServerResponse } from "node:http";

import type { Connect } from "vite";

type HandleFunction = Connect.NextHandleFunction;

export interface AdapterServer<TInstance = any> {
  instance(): TInstance;

  use(this: InternalAdapterServer<TInstance>, ...methods: HandleFunction[]): void;

  get(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  post(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  put(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  patch(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;
  delete(this: InternalAdapterServer<TInstance>, path: string, ...methods: HandleFunction[]): void;

  handler(this: InternalAdapterServer<TInstance>): (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
}

export type InternalAdapterServer<TInstance = any> = Record<"instance", TInstance> &
  Omit<AdapterServer<TInstance>, "instance">;
