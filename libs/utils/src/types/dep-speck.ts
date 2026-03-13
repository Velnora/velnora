import type { Key } from "@velnora/types";

export interface DepSpec<TKey extends Key> {
  key: TKey;
  parents?: Iterable<TKey>;
  children?: Iterable<TKey>;
}
