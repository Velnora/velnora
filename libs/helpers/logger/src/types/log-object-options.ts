import type { LogLevel, LogType } from "consola";

import type { EmojiTag } from "../utils/emoji";

export interface LogObjectOptions {
  type: LogType;
  level: LogLevel;
  emoji: EmojiTag;
  messages: any[];
}
