import type { ArgumentsCamelCase } from "yargs";

import type { ParsedSpec } from "./parsed-spec";

export interface CommandDef<TAccum extends object = object> {
  name: string;
  aliases: string[];
  describe?: string;
  commands: CommandDef[];
  options: ParsedSpec[];
  handler?: (a: ArgumentsCamelCase<TAccum>) => void | Promise<void>;
}
