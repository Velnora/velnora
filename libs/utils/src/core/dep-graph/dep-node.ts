import type { Key } from "@velnora/types";

import type { DepNodeLike } from "../../types/dep-node-like";

export class DepNode<TValue, TKey extends Key = string> implements DepNodeLike<TValue, TKey> {
  readonly key: TKey;
  value?: TValue;

  readonly parents = new Set<DepNodeLike<TValue, TKey>>();
  readonly children = new Set<DepNodeLike<TValue, TKey>>();

  inDegree = 0;
  outDegree = 0;

  constructor(key: TKey, value?: TValue) {
    this.key = key;
    this.value = value;
  }
}
