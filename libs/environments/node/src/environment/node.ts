import { type IncomingMessage, type ServerResponse, createServer as createNodeServer } from "node:http";

import { satisfies } from "semver";

import { defineEnvironment } from "@velnora/utils/node";

export default defineEnvironment({
  isValidEnvironment(runtime) {
    return runtime.runtime === "node" && satisfies(process.versions.node, runtime.runtimeVersion);
  },

  createServer(handler: (req: IncomingMessage, res: ServerResponse) => void) {
    return createNodeServer(handler);
  }
});
