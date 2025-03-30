export type ParseUrlParamSection<TPath extends string> = TPath extends `:${infer TParam}(${string})`
  ? TParam
  : TPath extends `:${infer TParam}`
    ? TParam
    : never;
