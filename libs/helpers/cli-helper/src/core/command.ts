import type { CamelCase, Promisable } from "type-fest";

import type { CommandOptions } from "../types/command-option";
import type { CommandReturnType } from "../types/command-return-type";
import type { CommandsType } from "../types/commands-type";
import type { InferType } from "../types/infer-type";
import type { LiteralType } from "../types/literal-type";
import type { MergeObjects } from "../types/merge-objects";
import type { Option, PositionalOption, PositionalOptions } from "../types/options";
import type { Type } from "../types/type";
import { logger } from "../utils/logger";

export class Command<TOptions extends Record<string, Type> = {}> {
  private positionalMap = new Map<string, PositionalOptions>();
  private positionalArguments = new Set<string>();
  private options = {} as CommandOptions<TOptions>;
  private childCommands = [] as CommandsType;

  constructor(
    private command: string,
    private readonly description?: string
  ) {
    logger.debug(`Created command: ${command} - ${description}`);
  }

  positional<TProperty extends string, TAliasName extends string = TProperty>(
    property: TProperty,
    description: string,
    options?: Omit<PositionalOption<TAliasName>, "name" | "description">
  ): Command<
    MergeObjects<
      TOptions,
      Record<TProperty | TAliasName | CamelCase<TProperty> | CamelCase<TAliasName>, Type<"string", never>>
    >
  > {
    logger.debug(`Adding positional argument: ${property} - Options:`, options);
    const { default: defaultValue, required = true } = options || {};
    if (this.positionalMap.has(property)) {
      logger.warn(`Positional argument ${property} already exists. Overwriting.`);
    }
    this.positionalMap.set(property, { name: property, description, default: defaultValue ?? undefined, required });
    this.positionalArguments.add(property);
    return this as any;
  }

  option<
    TName extends string,
    TType extends LiteralType,
    TAliasName extends string = TName,
    TUnionType extends string = string
  >(
    name: TName,
    type: TType | Option<TType, TAliasName> | (Option<"union", TAliasName> & { values: TUnionType[] })
  ): Command<
    MergeObjects<
      TOptions,
      Record<TName | TAliasName | CamelCase<TName> | CamelCase<TAliasName>, Type<TType, TUnionType>>
    >
  > {
    const resolvedValue = (typeof type === "string" ? { type } : type) as
      | Option<TType, TAliasName>
      | (Option<"union", TAliasName> & { values: TUnionType[] });
    const defaultValue = resolvedValue.default || null;

    // @ts-ignore
    this.options[name] = {
      type: resolvedValue.type,
      default: defaultValue,
      values: "values" in resolvedValue ? resolvedValue.values : [],
      description: resolvedValue.description,
      alias: resolvedValue.alias
    } as Option<TType, TUnionType>;
    logger.debug(`Added option: ${name} - Type: ${resolvedValue.type}, Default: ${defaultValue}`);
    return this as any;
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
      positionalOptions: Array.from(this.positionalArguments).map(arg => this.positionalMap.get(arg)!),
      childCommands: this.childCommands,
      async execute(args) {
        logger.debug(`Executing command: ${self.command} with args:`, args);
        await executorFn?.(args as any);
      }
    };
  }
}
