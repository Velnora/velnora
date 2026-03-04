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

  listen(port: number): Promisable<Http.Server>;
  listen(port: number, hostname: string): Promisable<Http.Server>;

  close(): Promisable<void>;
}
