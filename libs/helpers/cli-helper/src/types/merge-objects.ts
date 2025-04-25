import type { Prettify } from "@fluxora/types";

export type MergeObjects<T, U> = Prettify<Omit<T, keyof U> & U>;
