export type ValueToken<S extends string> = S extends `${string}<${infer T}>${string}`
  ? T
  : S extends `${string}[${infer T}]${string}`
    ? T
    : never;
