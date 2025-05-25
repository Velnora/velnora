import type { ConsolaReporter } from "consola";
import pc from "picocolors";

import { envLogLevel } from "../const";
import { type CreateLoggerOptions, LogFormats } from "../types";
import type { InternalLogObject } from "../types/internal-log-object";
import { colorize } from "../utils/colorize";
import { colors } from "../utils/colors";
import { formatTimestamp } from "../utils/format-timestamp";

export const baseReporter = ({
  name,
  format = LogFormats.Default,
  transformers = {}
}: CreateLoggerOptions): ConsolaReporter => {
  const transformJson = transformers?.json || (requestObject => requestObject);
  const transformData = transformers?.data || (logs => logs);

  return {
    log(logObjectRaw) {
      if (logObjectRaw.level > envLogLevel) return;
      const logObject = logObjectRaw as InternalLogObject;

      if (format === LogFormats.JSON) {
        console.log(
          JSON.stringify(
            transformJson({
              name,
              timestamp: logObject.date.toISOString(),
              level: logObject.type,
              data: transformData(logObject.args)
            })
          )
        );
        return;
      }

      const object = {
        name,
        tag: name,
        timestamp: formatTimestamp(logObject.date),
        type: logObject.type,
        level: logObject.level,
        emoji: logObject.emoji
      };

      let messagePrefix = format as string;
      for (const key in object) messagePrefix = messagePrefix.replace(`{${key}}`, (object as any)[key]);
      const color = colors[logObject.type] || ((x: string) => x);
      const prefix = pc.bold(color(messagePrefix));
      console.log(prefix, ...logObject.args.map(arg => colorize(arg)));
    }
  };
};
