/**
 * @velnora-meta
 * type: author
 * project: Velnora
 * author: MDReal
 * package: @velnora/adapter-h3
 * layer: tooling
 * visibility: public
 */
import type { IncomingMessage, Server, ServerResponse } from "node:http";

import { H3, defineEventHandler } from "h3";
import { toNodeHandler } from "h3/node";
import { listen } from "listhen";

import { defineAdapter } from "@velnora/utils";

import pkgJson from "../package.json";
import type { HttpAdapter } from "./types/http-adapter";

export default defineAdapter({
  name: "h3",
  version: pkgJson.version,
  capabilities: ["http", "h3"],

  configure(ctx) {
    const h3 = new H3();
    let server: Server;

    const httpAdapter: HttpAdapter = {
      use(routeOrHandler, ...handlers) {
        if (typeof routeOrHandler === "string") {
          const handler = handlers[0];

          h3.all(
            routeOrHandler,
            defineEventHandler(event => {
              const nodeReq = event.runtime?.node?.req;
              const nodeRes = event.runtime?.node?.res;

              if (!nodeReq || !nodeRes) {
                throw new Error("H3 adapter requires Node.js request and response objects.");
              }

              return handler(nodeReq as IncomingMessage, nodeRes as ServerResponse);
            })
          );
        }
      },
      async listen(port, host) {
        const listener = await listen(toNodeHandler(h3), { port, hostname: host, showURL: false });
        server = listener.server;
        return server;
      },
      close() {
        server.close();
      }
    };

    ctx.expose({ http: httpAdapter, h3: httpAdapter });
  },

  async dev() {},

  build() {}
});
