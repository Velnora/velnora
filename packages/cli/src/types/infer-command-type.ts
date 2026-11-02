/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { Command } from "../core";

/**
 * Infers the options type from a `Command` instance.
 *
 * @template TCommand - The command instance type.
 * @example
 * ```ts
 * const cmd = program.command("foo").option("--bar <string>");
 * type Options = inferCommandType<typeof cmd>; // { bar: string }
 * ```
 */

// biome-ignore lint/suspicious/noExplicitAny: Conditional inference matches arbitrary command implementations.
export type inferCommandType<TCommand extends Command<any>> =
  TCommand extends Command<infer TOptions> ? TOptions : never;
