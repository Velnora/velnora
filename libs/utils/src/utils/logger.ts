import { createLogger } from "../node/create-logger";

export const logger = createLogger({
  name: "fluxora/utils",
  logLevel: process.env.LOG_LEVEL || "info"
});
