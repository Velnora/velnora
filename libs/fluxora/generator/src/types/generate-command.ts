import type { Promisable } from "type-fest";

export interface GenerateCommand<TOptions = void> {
  (options: TOptions): Promisable<void>;
}
