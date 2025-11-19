export type NonEmpty<S extends string> = S extends "" ? never : S;
