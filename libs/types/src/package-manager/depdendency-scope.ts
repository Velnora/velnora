export type DependencyScope =
  | "runtime" // production dependency
  | "dev" // development only
  | "test" // test only
  | "provided"; // JVM concept — expected at runtime but not bundled
