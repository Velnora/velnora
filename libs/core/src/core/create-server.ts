import type { CreateServerOptions } from "./create-server.types";
import { Server } from "./server";

export const createServer = async (options?: CreateServerOptions) => {
  const server = new Server(options);
  await server.init();
  return server;
};
