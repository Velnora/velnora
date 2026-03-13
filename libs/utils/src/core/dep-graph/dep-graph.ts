/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { Promisable } from "type-fest";

import type { Key } from "@velnora/types";

import type { DepNodeLike } from "../../types/dep-node-like";
import type { DepSpecOrKey } from "../../types/dep-spec-or-node";
import type { DepSpec } from "../../types/dep-speck";
import { isKey } from "../../utils/is-key";
import { DepNode } from "./dep-node";

export class DepGraph<TValue, TKey extends Key = string>
  implements Iterable<DepNodeLike<TValue, TKey>>, Iterable<DepNodeLike<TValue, TKey>>
{
  private readonly nodes = new Map<TKey, DepNode<TValue, TKey>>();
  private readonly rootsSet = new Set<DepNode<TValue, TKey>>();

  constructor(
    private readonly specOf: (item: TValue) => DepSpecOrKey<TKey>,
    items?: Iterable<TValue>
  ) {
    if (items) this.addMany(items);
  }

  get top() {
    return this.rootsSet;
  }

  get(key: TKey) {
    return this.nodes.get(key);
  }

  link(parent: TKey | DepNodeLike<TValue, TKey>, child: TKey | DepNodeLike<TValue, TKey>) {
    const parentNode = this.resolve(parent);
    const childNode = this.resolve(child);

    if (parentNode.children.has(childNode)) return;

    parentNode.children.add(childNode);
    childNode.parents.add(parentNode);

    parentNode.outDegree++;

    if (++childNode.inDegree === 1) {
      this.rootsSet.delete(childNode);
    }
  }

  add(item: TValue) {
    const spec = this.normalize(this.specOf(item));

    const node = this.getOrCreate(spec.key);
    node.value = item;

    if (spec.parents) {
      for (const parent of spec.parents) {
        this.link(parent, node);
      }
    }

    if (spec.children) {
      for (const child of spec.children) {
        this.link(node, child);
      }
    }

    return node;
  }

  addMany(items: Iterable<TValue>) {
    for (const item of items) {
      this.add(item);
    }
  }

  has<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => value is TNext
  ): boolean;
  has(predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => boolean): boolean;
  has(predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => boolean) {
    let index = 0;

    for (const node of this) {
      if (node.value === undefined) continue;
      if (predicate(node.value, index++, this)) {
        return true;
      }
    }

    return false;
  }

  find<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => value is TNext
  ): TNext | undefined;

  find(predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => boolean): TValue | undefined;

  find<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => Promise<boolean>
  ): Promise<TNext | TValue | undefined>;

  find<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => Promisable<boolean>
  ) {
    let index = 0;

    for (const node of this) {
      if (node.value === undefined) continue;

      const r = predicate(node.value, index++, this);

      if (r instanceof Promise) {
        return (async () => {
          if (await r) return node.value as TNext;

          for (const n of this) {
            if (n.value === undefined) continue;
            if (await predicate(n.value, index++, this)) return n.value as TNext;
          }
        })();
      }

      if (r) return node.value as TNext;
    }
  }

  forEach(callback: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => void) {
    let index = 0;

    for (const node of this) {
      if (node.value === undefined) continue;
      callback(node.value, index++, this);
    }
  }

  map<TResult>(mapper: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => TResult): TResult[] {
    const result: TResult[] = [];
    let index = 0;

    for (const node of this) {
      if (node.value === undefined) continue;

      result.push(mapper(node.value, index++, this));
    }

    return result;
  }

  filter<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => value is TNext
  ): DepGraph<TNext, TKey>;

  filter(predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => boolean): DepGraph<TValue, TKey>;

  filter<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => Promise<boolean>
  ): Promise<DepGraph<TNext, TKey>>;

  filter(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => Promise<boolean>
  ): Promise<DepGraph<TValue, TKey>>;
  filter<TNext extends TValue>(
    predicate: (value: TValue, index: number, graph: DepGraph<TValue, TKey>) => boolean | Promise<boolean>
  ) {
    const result = new DepGraph<TNext, TKey>(this.specOf as (item: TNext) => DepSpecOrKey<TKey>);

    const kept = new Set<TKey>();
    let index = 0;

    for (const node of this) {
      if (node.value === undefined) continue;

      const r = predicate(node.value, index++, this);

      if (r instanceof Promise) {
        return (async () => {
          if (await r) {
            kept.add(node.key);
            result.add(node.value as TNext);
          }

          for (const n of this) {
            if (n.value === undefined) continue;

            if (await predicate(n.value, index++, this)) {
              kept.add(n.key);
              result.add(n.value as TNext);
            }
          }

          for (const node of this.nodes.values()) {
            if (!kept.has(node.key)) continue;

            for (const child of node.children) {
              if (kept.has(child.key)) {
                result.link(node.key, child.key);
              }
            }
          }

          return result;
        })();
      }

      if (r) {
        kept.add(node.key);
        result.add(node.value as TNext);
      }
    }

    for (const node of this.nodes.values()) {
      if (!kept.has(node.key)) continue;

      for (const child of node.children) {
        if (kept.has(child.key)) {
          result.link(node.key, child.key);
        }
      }
    }

    return result;
  }

  *[Symbol.iterator]() {
    const indeg = new Map<TKey, number>();
    const queue: DepNode<TValue, TKey>[] = [];

    for (const node of this.nodes.values()) {
      indeg.set(node.key, node.inDegree);
      if (node.inDegree === 0) queue.push(node);
    }

    let visited = 0;

    while (queue.length) {
      const node = queue.shift()!;
      visited++;
      yield node;

      for (const child of node.children) {
        const next = (indeg.get(child.key) ?? 0) - 1;
        indeg.set(child.key, next);

        if (next === 0) queue.push(child);
      }
    }

    if (visited !== this.nodes.size) {
      throw new Error("Dependency cycle detected.");
    }
  }

  toArray() {
    return Array.from(this, node => node.value).filter((a): a is TValue => !!a);
  }

  get size() {
    return this.nodes.size;
  }

  private getOrCreate(key: TKey) {
    let node = this.nodes.get(key);

    if (!node) {
      node = new DepNode<TValue, TKey>(key);
      this.nodes.set(key, node);
      this.rootsSet.add(node);
    }

    return node;
  }

  private normalize(spec: DepSpecOrKey<TKey>) {
    return isKey(spec) ? ({ key: spec } as DepSpec<TKey>) : (spec as DepSpec<TKey>);
  }

  private resolve(v: TKey | DepNodeLike<TValue, TKey>) {
    return v instanceof DepNode ? (v as DepNode<TValue, TKey>) : this.getOrCreate(v as TKey);
  }
}
