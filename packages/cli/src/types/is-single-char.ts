export type IsSingleChar<S extends string> = S extends `${infer _C}${infer Rest}` ? (Rest extends "" ? true : false) : false;
