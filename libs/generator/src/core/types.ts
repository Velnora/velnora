import type { Package, TypesApi } from "@velnora/types";

import type { TypeGenerator } from "./type-generator";

export class Types implements TypesApi {
  constructor(
    private readonly pkg: Package,
    private readonly typeGenerator: TypeGenerator
  ) {}
}
