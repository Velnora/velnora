import type { ArgumentsCamelCase } from "yargs";

import type { ParsedSpec } from "./parsed-spec";

export interface CommandDef {
  name: string; // "dev"
  desc?: string;
  options: ParsedSpec[]; // command-local options
  handler?: (a: ArgumentsCamelCase<Record<string, unknown>>) => void | Promise<void>;
}
