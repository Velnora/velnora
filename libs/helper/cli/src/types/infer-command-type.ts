import type { SingleCommand } from "../core/single-command";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type inferCommandType<TCommand extends SingleCommand<any>> =
  TCommand extends SingleCommand<infer TOptions> ? TOptions : never;
