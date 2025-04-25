import type { CreateServerOptions } from "@fluxora/types";

import { createDevServer } from "../core";

export const dev = async (options?: CreateServerOptions) => {
  await createDevServer(options);
};
