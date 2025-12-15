import type { LogLevel } from "./log-level";

export type LogLevelNames = Lowercase<keyof typeof LogLevel>;
