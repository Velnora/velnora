import type { CamelCase, Promisable } from "type-fest";

import type { CommandOptions } from "../types/command-option";
import type { CommandReturnType } from "../types/command-return-type";
import type { InferType } from "../types/infer-type";
import type { LiteralType } from "../types/literal-type";
import type { MergeObjects } from "../types/merge-objects";
import type { OptionType } from "../types/option-type";
import type { Type } from "../types/type";
import { logger } from "../utils/logger";
import type { CommandsType } from "./commands";

export class Command<TOptions extends Record<string, Type> = {}> {
  private options = {} as CommandOptions<TOptions>;
  private childCommands = [] as CommandsType;

  constructor(
    private command: string,
    private readonly description?: string
  ) {
    logger.debug(`Created command: ${command} - ${description}`);
  }

  option<
    TName extends string,
    TType extends LiteralType,
    TAliasName extends string = TName,
    TUnionType extends string = string
  >(
    name: TName,
    type: TType | OptionType<TType, TAliasName> | (OptionType<"union", TAliasName> & { values: TUnionType[] })
  ) {
    const resolvedValue = (typeof type === "string" ? { type } : type) as
      | OptionType<TType, TAliasName>
      | (OptionType<"union", TAliasName> & { values: TUnionType[] });
    const defaultValue = resolvedValue.defaultValue || null;

    // @ts-ignore
    this.options[name] = {
      type: resolvedValue.type,
      defaultValue,
      values: "values" in resolvedValue ? resolvedValue.values : [],
      description: resolvedValue.description,
      alias: resolvedValue.alias
    } as OptionType<TType, TUnionType>;
    logger.debug(`Added option: ${name} - Type: ${resolvedValue.type}, Default: ${defaultValue}`);
    return this as unknown as Command<
      MergeObjects<
        TOptions,
        Record<TName | TAliasName | CamelCase<TName> | CamelCase<TAliasName>, Type<TType, TUnionType>>
      >
    >;
  }

  children(...commands: CommandsType) {
    logger.debug(`Adding child commands to: ${this.command}`);
    this.childCommands.push(...commands);
    return this;
  }

  execute(
    executorFn?: (args: {
      [K in keyof TOptions]: InferType<TOptions[K]["type"], TOptions[K]["values"]>;
    }) => Promisable<void>
  ): CommandReturnType<{ [K in keyof TOptions]: TOptions[K] }> {
    logger.debug(`Setting execute handler for command: ${this.command}`);
    const self = this;
    return {
      command: this.command,
      description: this.description ?? null,
      options: this.options,
      childCommands: this.childCommands,
      async execute(args) {
        logger.debug(`Executing command: ${self.command} with args:`, args);
        await executorFn?.(args as any);
      }
    };
  }
}
