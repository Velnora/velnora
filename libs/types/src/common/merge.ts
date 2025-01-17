import type { Prettify } from "./prettify";

export type Merge<T, U> = Prettify<Omit<T, keyof U> & U>;
