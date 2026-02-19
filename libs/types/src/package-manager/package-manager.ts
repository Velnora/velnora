import type { AddOptions } from "nx/src/command-line";

import type { Artifact } from "../utils/artifact";
import type { AuditResult } from "./audit-result";
import type { Dependency } from "./dependency";
import type { DependencyTree } from "./dependency-tree";
import type { InstallOptions } from "./install-options";
import type { OutdatedResult } from "./outdated-result";

export interface PackageManager {
  name: string; // e.g. "npm", "maven", "nuget", "cargo"
  runtime: string; // which toolchain this belongs to

  // Resolution
  detect(cwd: string): Promise<boolean>; // lockfile/manifest detection
  resolveBinary(): Promise<string>; // path to the pm binary

  // Manifest & Lockfile
  manifestName: string; // e.g. "package.json", "build.gradle.kts", "*.csproj"
  lockfileName?: string; // e.g. "yarn.lock", "gradle.lockfile" — optional, not all PMs have lockfiles

  // Core operations (required)
  install(opts?: InstallOptions): Promise<void>;
  list(): Promise<DependencyTree>;

  // Mutation operations (optional — not all PMs have CLI support)
  add?(deps: Dependency[], opts?: AddOptions): Promise<void>;
  remove?(deps: string[]): Promise<void>;

  // Analysis operations (optional)
  publish?(artifact: Artifact): Promise<void>;
  audit?(): Promise<AuditResult>;
  outdated?(): Promise<OutdatedResult>;
}
