import type { Command } from "../core/command";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type inferCommandType<TCommand extends Command<any>> =
  TCommand extends Command<infer TOptions> ? TOptions : never;
