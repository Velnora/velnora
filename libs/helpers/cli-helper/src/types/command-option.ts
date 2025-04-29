import type { Option } from "./options";
import type { Type } from "./type";

export type CommandOptions<TOptions extends Record<string, Type>> = {
  [K in keyof TOptions]: Option<TOptions[K]["type"]> | (Option<"union"> & { values: TOptions[K]["values"] });
};
