/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type Http from "http";

import type { Promisable } from "type-fest";

import type { HttpHandler } from "./http-handler";

export interface BaseHttpAdapter {
  use(...handlers: HttpHandler[]): void;
  use(route: string, handlers: HttpHandler): void;

  listen(port?: number, hostname?: string): Promisable<Http.Server>;

  close(): Promisable<void>;
}
