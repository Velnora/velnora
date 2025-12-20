import type { TypesApi } from "../context";
import type { Package } from "../package";

export interface TypeGenerator {
  withApp(pkg: Package): TypesApi;
}
