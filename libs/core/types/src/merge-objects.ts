import type { Prettify } from "./prettify";

export type MergeObjects<T, U> = Prettify<Omit<T, keyof U> & U>;
