import type { Command } from "../core/command";

export type inferCommandType<TCommand extends Command> = TCommand extends Command<infer TOptions> ? TOptions : never;
