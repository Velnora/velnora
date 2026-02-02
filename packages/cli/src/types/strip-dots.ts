export type StripDots<S extends string> = S extends `${infer T}...` ? T : S;
