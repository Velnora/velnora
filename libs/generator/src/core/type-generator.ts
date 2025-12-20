import type { Package, TypeGenerator as VelnoraTypeGenerator } from "@velnora/types";

import { Types } from "./types";

export class TypeGenerator implements VelnoraTypeGenerator {
  withApp(pkg: Package) {
    return new Types(pkg, this);
  }
}
