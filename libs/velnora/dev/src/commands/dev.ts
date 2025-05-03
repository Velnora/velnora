import type { CreateServerOptions } from "@velnora/types";

import { createDevServer } from "../core";

export const dev = async (options?: CreateServerOptions) => {
  await createDevServer(options);
};
