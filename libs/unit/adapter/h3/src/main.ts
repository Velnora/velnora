/**
 * @velnora-meta
 * type: author
 * project: Velnora
 * author: MDReal
 * package: @velnora/adapter-h3
 * layer: tooling
 * visibility: public
 */
import { defineAdapter } from "@velnora/utils";

import pkgJson from "../package.json";
import type { HttpAdapter } from "./types/http-adapter";

export default defineAdapter({
  name: "h3",
  version: pkgJson.version,
  capabilities: ["http", "h3"],

  configure(ctx) {
    const httpAdapter: HttpAdapter = {
      use() {},
      listen() {},
      close() {}
    };

    ctx.expose({ http: httpAdapter, h3: httpAdapter });
  },

  async dev() {},

  build() {}
});
