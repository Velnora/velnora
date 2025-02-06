import { createLogger } from "@fluxora/utils/node";

export const logger = createLogger({
  name: "fluxora/server",
  logLevel: process.env.LOG_LEVEL || "info"
});
