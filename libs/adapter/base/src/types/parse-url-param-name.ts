import type { ParseUrlParamSection } from "./parse-url-param-section";

export type ParseUrlParamName<TPath extends string> = TPath extends `${infer TSection}/${infer TRest}`
  ? ParseUrlParamSection<TSection> | ParseUrlParamName<TRest>
  : ParseUrlParamSection<TPath>;
