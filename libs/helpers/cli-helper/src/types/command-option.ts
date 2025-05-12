import type { Option } from "./options";
import type { Type } from "./type";

export type CommandOptions<TOptions extends Record<string, Type>> = {
  [K in keyof TOptions]:
    | Option<TOptions[K]["type"], string, keyof TOptions>
    | (Option<"union", string, keyof TOptions> & { values: TOptions[K]["values"] });
};
