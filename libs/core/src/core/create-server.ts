import { createDevServer } from "./create-dev-server";
import { createProdServer } from "./create-prod-server";
import type { CreateServerOptions } from "./create-server.types";

export const createServer = async (options: CreateServerOptions) => {
  if (options.env === "development") {
    return createDevServer(options);
  }

  return createProdServer(options);
};
