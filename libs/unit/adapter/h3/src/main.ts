/**
 * @velnora-meta
 * type: author
 * project: Velnora
 * author: MDReal
 * package: @velnora/adapter-h3
 * layer: tooling
 * visibility: public
 */
import type { BaseHttpAdapter } from "@velnora/types";
import { defineAdapter } from "@velnora/utils";

import pkgJson from "../package.json";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HttpAdapter extends BaseHttpAdapter {}

declare global {
  namespace Velnora {
    export interface UnitRegistry {
      http: HttpAdapter;
      h3: HttpAdapter;
    }
  }
}

export default defineAdapter(() => {
  return {
    name: "h3",
    version: pkgJson.version,
    capabilities: ["http", "h3"],

    required: [""],

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
  };
});
