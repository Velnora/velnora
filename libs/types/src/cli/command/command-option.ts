import type { Type } from "../type";
import type { OptionType } from "./option-type";

export type CommandOptions<TOptions extends Record<string, Type>> = {
  [K in keyof TOptions]: OptionType<TOptions[K]["type"]> | (OptionType<"union"> & { values: TOptions[K]["values"] });
};
