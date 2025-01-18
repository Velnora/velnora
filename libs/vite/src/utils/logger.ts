import { createLogger } from "@fluxora/utils";

export const logger = createLogger({
  name: "fluxora/vite",
  logLevel: process.env.LOG_LEVEL || "info"
});
