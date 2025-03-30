import type { Arguments } from "yargs";

import type { CommandOptions } from "./command-option";
import type { Type } from "./type";

export interface CommandReturnType<TOptions extends Record<string, Type>> {
  command: string;
  description: string | null;
  options: CommandOptions<TOptions>;
  execute(args: Omit<Arguments, "_" | "$0">): Promise<void>;
}
