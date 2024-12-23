import { Command, type CommandReturnType } from "../../utils/command";
import type { LiteralType } from "../commands/literal-type";
import type { InferType } from "./infer-type";

export type InferArgs<T extends Command<any> | CommandReturnType<any>> =
  T extends Command<infer TOptions>
    ? TOptions
    : T extends CommandReturnType<infer TOptions extends Record<string, LiteralType>>
      ? { [K in keyof TOptions]: InferType<TOptions[K]> }
      : never;
