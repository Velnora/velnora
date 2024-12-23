import { Arguments } from 'yargs';
import { CamelCase } from 'type-fest';
import { Promisable } from 'type-fest';

export declare const cli: () => Promise<void>;

declare class Command<TOptions extends Record<string, LiteralType> = {}> {
    private readonly command;
    private readonly description?;
    private options;
    constructor(command: string, description?: string | undefined);
    option<TName extends string, TType extends LiteralType, TAliasName extends string = TName>(name: TName, type: TType | OptionType<TType, TAliasName>): Command<Merge<TOptions, Record<TName | TAliasName | CamelCase<TName> | CamelCase<TAliasName>, TType>>>;
    execute(executorFn?: (args: {
        [K in keyof TOptions]: InferType<TOptions[K]>;
    }) => Promisable<void>): CommandReturnType<{
        [K in keyof TOptions]: TOptions[K];
    }>;
}

declare type CommandOptions<TOptions extends Record<string, LiteralType>> = {
    [K in keyof TOptions]: OptionType<TOptions[K]>;
};

declare interface CommandReturnType<TOptions extends Record<string, LiteralType>> {
    command: string;
    description: string | null;
    options: CommandOptions<TOptions>;
    execute(args: Omit<Arguments, "_" | "$0">): Promise<void>;
}

export declare type InferArgs<T extends Command<any> | CommandReturnType<any>> = T extends Command<infer TOptions> ? TOptions : T extends CommandReturnType<infer TOptions extends Record<string, LiteralType>> ? {
    [K in keyof TOptions]: InferType<TOptions[K]>;
} : never;

declare type InferType<T extends LiteralType> = T extends "string" ? string : T extends "number" ? number : T extends "boolean" ? boolean : never;

declare type LiteralType = "string" | "number" | "boolean";

declare type Merge<T, U> = Omit<T, keyof U> & U;

declare type OptionType<TType extends LiteralType, TAlias extends string = string> = {
    type: TType;
    alias?: TAlias;
    description?: string;
    defaultValue?: InferType<TType> | null;
};

export { }
