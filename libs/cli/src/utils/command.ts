import type { CamelCase, Promisable } from "type-fest";
import type { Arguments } from "yargs";

import type { LiteralType } from "../types/commands/literal-type";
import type { Merge } from "../types/commands/merge";
import type { OptionType } from "../types/commands/option-type";
import type { InferType } from "../types/infer/infer-type";
import { logger } from "./logger";

type CommandOptions<TOptions extends Record<string, LiteralType>> = {
  [K in keyof TOptions]: OptionType<TOptions[K]>;
};

export interface CommandReturnType<TOptions extends Record<string, LiteralType>> {
  command: string;
  description: string | null;
  options: CommandOptions<TOptions>;
  execute(args: Omit<Arguments, "_" | "$0">): Promise<void>;
}

export class Command<TOptions extends Record<string, LiteralType> = {}> {
  private options = {} as CommandOptions<TOptions>;

  constructor(
    private readonly command: string,
    private readonly description?: string
  ) {
    logger.debug(`Created command: ${command} - ${description}`);
  }

  option<TName extends string, TType extends LiteralType, TAliasName extends string = TName>(
    name: TName,
    type: TType | OptionType<TType, TAliasName>
  ): Command<Merge<TOptions, Record<TName | TAliasName | CamelCase<TName> | CamelCase<TAliasName>, TType>>> {
    const resolvedValue = (typeof type === "string" ? { type } : type) as OptionType<TType>;
    const defaultValue = resolvedValue.defaultValue || null;

    const self = this as unknown as Command<
      Merge<TOptions, Record<TName | TAliasName | CamelCase<TName> | CamelCase<TAliasName>, TType>>
    >;
    // @ts-ignore
    self.options[name] = {
      type: resolvedValue.type,
      defaultValue,
      description: resolvedValue.description,
      alias: resolvedValue.alias
    } satisfies OptionType<TType>;
    logger.debug(`Added option: ${name} - Type: ${resolvedValue.type}, Default: ${defaultValue}`);
    return self;
  }

  execute(
    executorFn?: (args: { [K in keyof TOptions]: InferType<TOptions[K]> }) => Promisable<void>
  ): CommandReturnType<{ [K in keyof TOptions]: TOptions[K] }> {
    logger.debug(`Setting execute handler for command: ${this.command}`);
    const self = this;
    return {
      command: this.command,
      description: this.description ?? null,
      options: this.options,
      async execute(args) {
        logger.debug(`Executing command: ${self.command} with args:`, args);
        await executorFn?.(args as any);
      }
    };
  }
}
