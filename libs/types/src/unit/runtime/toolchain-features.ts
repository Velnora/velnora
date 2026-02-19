export interface ToolchainFeatures extends Velnora.Toolchain.Features {
  hotReload?: boolean; // Node, JVM (Spring DevTools) — not Go
  incrementalBuild?: boolean; // JVM (Gradle), .NET, TypeScript
  nativeImage?: boolean; // JVM (GraalVM), Go, Rust
  workspaces?: boolean; // Monorepo support (yarn workspaces, gradle multi-module)
  lockfile?: boolean; // Does the PM produce a lockfile?
  audit?: boolean; // Vulnerability scanning
  privateRegistry?: boolean; // Supports custom registries
}
