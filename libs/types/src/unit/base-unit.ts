export interface BaseUnit<TRequiredUnits extends readonly string[], TOptionalUnits extends readonly string[]> {
  name: string;
  version: string;
  required: TRequiredUnits;
  optional: TOptionalUnits;
  capabilities?: string[];
}
