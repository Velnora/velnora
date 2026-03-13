/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { Key } from "@velnora/types";

export interface DepNodeLike<TValue, TKey extends Key = string> {
  readonly key: TKey;
  value?: TValue;
  readonly parents: Set<DepNodeLike<TValue, TKey>>;
  readonly children: Set<DepNodeLike<TValue, TKey>>;
  inDegree: number;
  outDegree: number;
}
