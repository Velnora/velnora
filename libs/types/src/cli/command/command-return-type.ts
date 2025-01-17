import type { Arguments } from "yargs";

import type { Type } from "../type";
import type { CommandOptions } from "./command-option";

export interface CommandReturnType<TOptions extends Record<string, Type>> {
  command: string;
  description: string | null;
  options: CommandOptions<TOptions>;
  execute(args: Omit<Arguments, "_" | "$0">): Promise<void>;
}
