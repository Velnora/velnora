/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { Key } from "@velnora/types";

import type { DepSpec } from "./dep-speck";

export type DepSpecOrKey<TKey extends Key> = DepSpec<TKey> | TKey;
