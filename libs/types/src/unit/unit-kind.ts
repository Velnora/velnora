/**
 * Discriminant enum for the three unit kinds in Velnora's plugin system.
 *
 * Every {@link VelnoraUnit} carries a `kind` property whose value is one of
 * these members. The kernel uses this discriminant to route units into the
 * correct lifecycle pipeline during boot.
 */
export enum UnitKind {
  /**
   * A **runtime** unit represents a language ecosystem or execution
   * environment (e.g. Node.js / JVM / .NET). It is the most fundamental
   * unit kind and implements the {@link Toolchain} lifecycle (compile,
   * execute, test, package).
   */
  RUNTIME = "runtime",

  /**
   * An **adapter** unit acts as a build-tool plugin, bridging Velnora's
   * orchestration layer to a concrete bundler or dev server such as Vite
   * or Webpack.
   */
  ADAPTER = "adapter",

  /**
   * An **integration** unit provides framework-specific glue code that
   * connects a UI framework (React, Angular, Vue, etc.) into the Velnora
   * host's rendering and routing pipelines.
   */
  INTEGRATION = "integration"
}
