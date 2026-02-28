/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { Promisable } from "type-fest";

import type { HttpHandler } from "./http-handler";

export interface BaseHttpAdapter {
  use(...handlers: HttpHandler[]): void;

  listen(port: number): Promisable<void>;
  listen(port: number, callback: () => void): Promisable<void>;
  listen(port: number, hostname: string): Promisable<void>;
  listen(port: number, hostname: string, callback: () => void): Promisable<void>;

  close(): Promisable<void>;
}
