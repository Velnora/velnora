import type { CleanToken } from "./clean-token";
import type { FirstWord } from "./first-word";
import type { IsSingleChar } from "./is-single-char";

export type ShortSegToken<T extends string> = T extends `-${infer R}`
  ? FirstWord<CleanToken<R>> extends infer Core extends string
    ? IsSingleChar<Core> extends true
      ? Core
      : never
    : never
  : never;