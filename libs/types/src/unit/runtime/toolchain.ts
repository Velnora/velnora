import type { PackageManager } from "../../package-manager";
import type { Project } from "../../project";
import type { Artifact } from "../../utils/artifact";
import type { CompileResult } from "./compile-result";
import type { ExecuteOptions } from "./execute-options";
import type { ProcessHandle } from "./process-handle";
import type { ResolvedToolchain } from "./resolved-toolchain";
import type { TestResult } from "./test-result";
import type { ToolchainContext } from "./toolchain-context";
import type { ToolchainFeatures } from "./toolchain-features";
import type { ToolchainProcess } from "./toolchain-process";

export interface Toolchain {
  name: string; // e.g. "jvm", "dotnet", "node", "go"
  runtime: string; // e.g. "java", "kotlin", "csharp", "typescript"

  // Resolution
  detect(cwd: string): Promise<boolean>; // Can this toolchain handle this project?
  resolve(ctx: ToolchainContext): Promise<ResolvedToolchain>;

  // Lifecycle
  compile(project: Project): ToolchainProcess<CompileResult>;
  execute(project: Project, opts?: ExecuteOptions): ToolchainProcess<ProcessHandle>;
  test(project: Project): ToolchainProcess<TestResult>;
  package(project: Project): ToolchainProcess<Artifact>;

  // Package Management
  packageManagers: PackageManager[]; // one toolchain can have multiple PMs
  resolvePackageManager(cwd: string): Promise<PackageManager>;

  // Optional extensions — toolchains opt-in via capabilities
  features?: ToolchainFeatures;
}
