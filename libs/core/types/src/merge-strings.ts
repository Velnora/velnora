export type MergeStrings<TStrings extends readonly string[], TMergePart extends string> = TStrings extends [
  infer TFistString extends string,
  ...infer TRestStrings extends string[]
]
  ? TRestStrings["length"] extends 0
    ? TFistString
    : `${TFistString}${TMergePart}${MergeStrings<TRestStrings, TMergePart>}`
  : never;
