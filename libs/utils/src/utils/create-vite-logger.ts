import { RollupError } from "rollup";
import { createLogger } from "vite";
import type { Logger } from "winston";

import { CONTROL_CHARS_RE, VITE_MESSAGES_RE } from "../const";

export const createViteLogger = (logger: Logger) => {
  const errors = new Set<Error | RollupError>();
  let hasWarned = false;

  return createLogger("info", {
    allowClearScreen: false,
    customLogger: {
      info(msg, _options) {
        const messageString = msg.replace(/[\n\r]+$/, "");
        const rawMessage = msg.replace(CONTROL_CHARS_RE, "").trim();

        if (!rawMessage.match(VITE_MESSAGES_RE)) {
          logger.info(messageString);
        }
      },
      warn(msg, _options) {
        logger.warn(msg);
      },
      error(msg, _options) {
        logger.error(msg);
      },
      warnOnce(msg, options) {
        hasWarned = true;
        if (!hasWarned) {
          this.warn(msg, options);
        }
      },
      get hasWarned() {
        return hasWarned;
      },
      hasErrorLogged(error) {
        const has = errors.has(error);
        if (!has) errors.add(error);
        return has;
      },
      clearScreen(_type) {}
    }
  });
};
