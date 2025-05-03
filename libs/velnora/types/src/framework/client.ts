import type { Promisable } from "type-fest";

export interface Client {
  mount(path: string): Promisable<void>;

  hydrate(path: string): Promisable<void>;
}
