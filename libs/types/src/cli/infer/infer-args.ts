import type { Command } from "../command/command";
import type { CommandReturnType } from "../command/command-return-type";
import type { Type } from "../type";
import type { InferType } from "./infer-type";

export type InferArgs<T extends Command<any> | CommandReturnType<any>> =
  T extends Command<infer TOptions>
    ? TOptions
    : T extends CommandReturnType<infer TOptions extends Record<string, Type>>
      ? { [K in keyof TOptions]: InferType<TOptions[K]["type"]> }
      : never;
