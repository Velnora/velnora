import { createLogger } from "@fluxora/utils";

export const logger = createLogger({
  name: "fluxora/cli",
  logLevel: process.env.LOG_LEVEL || "info"
});
