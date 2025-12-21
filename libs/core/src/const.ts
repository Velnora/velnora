import pc from "picocolors";

import { LogLevel } from "@velnora/types";

export const LEVEL_LABEL: Record<LogLevel, string> = {
  [LogLevel.TRACE]: "TRACE",
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.LOG]: "LOG",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.FATAL]: "FATAL"
};

export const LEVEL_COLOR: Record<LogLevel, (s: string) => string> = {
  [LogLevel.TRACE]: pc.cyanBright,
  [LogLevel.DEBUG]: pc.magentaBright,
  [LogLevel.LOG]: pc.greenBright,
  [LogLevel.WARN]: pc.yellowBright,
  [LogLevel.ERROR]: pc.redBright,
  [LogLevel.FATAL]: (s: string) => pc.bgRedBright(pc.whiteBright(s))
};
