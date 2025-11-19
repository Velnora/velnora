export type StripTrailingComma<S extends string> = S extends `${infer T},` ? StripTrailingComma<T> : S;
