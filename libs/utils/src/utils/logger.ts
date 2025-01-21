import { createLogger } from "../main";

export const logger = createLogger({
  name: "fluxora/utils",
  logLevel: process.env.LOG_LEVEL || "info"
});
