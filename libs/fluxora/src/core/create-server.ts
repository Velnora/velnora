import type { CreateServerOptions } from "@fluxora/types";

import { createDevServer } from "./create-dev-server";
import { createProdServer } from "./create-prod-server";

export const createServer = async (options?: CreateServerOptions) => {
  if (process.env.NODE_ENV === "development") {
    return createDevServer(options);
  } else {
    return createProdServer(options);
  }
};
