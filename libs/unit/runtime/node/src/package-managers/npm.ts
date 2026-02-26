import type {
  AddOptions,
  Artifact,
  AuditResult,
  Dependency,
  DependencyTree,
  InstallOptions,
  OutdatedResult,
  PackageManager
} from "@velnora/types";

export class NpmPackageManager implements PackageManager {
  readonly name = "npm";
  readonly manifestName = "package.json";
  readonly lockfileName = "package-lock.json";

  install(opts?: InstallOptions): Promise<void> {
    return Promise.resolve(undefined);
  }

  list(): Promise<DependencyTree> {
    return Promise.resolve(undefined);
  }

  // add(deps: Dependency[], opts?: AddOptions): Promise<void> {
  //   return Promise.resolve(undefined);
  // }
  //
  // remove(deps: string[]): Promise<void> {
  //   return Promise.resolve(undefined);
  // }
  //
  // publish(artifact: Artifact): Promise<void> {
  //   return Promise.resolve(undefined);
  // }
  //
  // audit(): Promise<AuditResult> {
  //   return Promise.resolve(undefined);
  // }
  //
  // outdated(): Promise<OutdatedResult> {
  //   return Promise.resolve(undefined);
  // }
}
