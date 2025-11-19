export type FirstWord<S extends string> = S extends `${infer A} ${string}` ? A : S;
