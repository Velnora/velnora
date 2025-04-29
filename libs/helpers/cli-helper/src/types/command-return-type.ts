import type { Arguments } from "yargs";

import type { CommandsType } from "../types/commands-type";
import type { CommandOptions } from "./command-option";
import type { PositionalOptions } from "./options";
import type { Type } from "./type";

export interface CommandReturnType<TOptions extends Record<string, Type> = Record<string, Type>> {
  command: string;
  description: string | null;
  options?: CommandOptions<TOptions>;
  positionalOptions: PositionalOptions[];
  execute?(args: Omit<Arguments, "_" | "$0">): Promise<void>;
  childCommands?: CommandsType;
}
