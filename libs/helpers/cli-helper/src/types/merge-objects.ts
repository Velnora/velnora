import type { Prettify } from "@velnora/types";

export type MergeObjects<T, U> = Prettify<Omit<T, keyof U> & U>;
