import type { DtsGeneratorApi } from "../context";
import type { Package } from "../package";

export interface TypeGenerator {
  readonly velnoraRoot: string;
  withApp(pkg: Package): DtsGeneratorApi;
}
