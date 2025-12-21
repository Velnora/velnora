import { createRequire } from "node:module";
import { dirname } from "node:path";

import type { Logger, Package, TypeGenerator as VelnoraTypeGenerator } from "@velnora/types";

import { DtsGenerator } from "./dts-generator";

const require = createRequire(import.meta.url);

export class TypeGenerator implements VelnoraTypeGenerator {
  readonly velnoraRoot = dirname(require.resolve("velnora/package.json"));

  constructor(private readonly logger: Logger) {}

  withApp(pkg: Package) {
    return new DtsGenerator(pkg, this, this.logger.extend({ logger: "Type Generator" }));
  }
}
