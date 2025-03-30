import type { CamelCase, Promisable } from "type-fest";

import type { MergeObjects } from "@fluxora/types";

import type { CommandReturnType } from "./command-return-type";
import type { InferType } from "./infer-type";
import type { LiteralType } from "./literal-type";
import type { OptionType } from "./option-type";
import type { Type } from "./type";

export interface Command<TOptions extends Record<string, Type> = {}> {
  option<
    TName extends string,
    TType extends LiteralType,
    TAliasName extends string = TName,
    TUnionType extends string = string
  >(
    name: TName,
    type: TType | OptionType<TType, TAliasName> | (OptionType<"union", TAliasName> & { values: TUnionType[] })
  ): Command<
    MergeObjects<
      TOptions,
      Record<TName | TAliasName | CamelCase<TName> | CamelCase<TAliasName>, Type<TType, TUnionType>>
    >
  >;

  execute(
    executorFn?: (args: {
      [K in keyof TOptions]: InferType<TOptions[K]["type"], TOptions[K]["values"]>;
    }) => Promisable<void>
  ): CommandReturnType<{ [K in keyof TOptions]: TOptions[K] }>;
}
