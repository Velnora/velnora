type SegmentParam<TString extends string> = TString extends `:${infer TPart}`
  ? TPart
  : TString extends `*${infer TPart}`
    ? TPart
    : never;

type ExtractParamsInner<TString extends string> = TString extends `${infer TSegment}/${infer TRest}`
  ? SegmentParam<TSegment> | ExtractParamsInner<TRest>
  : SegmentParam<TString>;

export type ExtractParams<TPath extends string> = TPath extends "" | "/"
  ? never
  : TPath extends `/${infer TRest}`
    ? ExtractParamsInner<TRest>
    : ExtractParamsInner<TPath>;
