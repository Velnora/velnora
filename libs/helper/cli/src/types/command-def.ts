import type { ArgumentsCamelCase } from "yargs";

import type { ParsedSpec } from "./parsed-spec";

export interface CommandDef<TAccum extends object = object> {
  name: string; // "dev"
  describe?: string;
  options: ParsedSpec[]; // command-local options
  handler?: (a: ArgumentsCamelCase<TAccum>) => void | Promise<void>;
}
