import type { CleanToken } from "./clean-token";
import type { FirstWord } from "./first-word";

export type LongSegToken<T extends string> = T extends `--${infer R}` ? CleanToken<FirstWord<R>> : never;
