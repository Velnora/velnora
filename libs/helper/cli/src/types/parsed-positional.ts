import type { PositionKind } from "./position-kind";

export interface ParsedPositional {
  name: string;
  type: PositionKind;
  array: boolean;
  choices: string[];
  isRequired: boolean;
}
