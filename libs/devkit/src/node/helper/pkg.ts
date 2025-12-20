import { intersects, satisfies, valid, validRange } from "semver";
import type { PackageJson } from "type-fest";

import type { PkgApi } from "@velnora/types";

export class Pkg implements PkgApi {
  constructor(private readonly packageJson: PackageJson) {}

  get dependencies() {
    return this.packageJson.dependencies || {};
  }

  get devDependencies() {
    return this.packageJson.devDependencies || {};
  }

  ensurePackage(pkg: string, range?: string) {
    const allDeps = { ...this.dependencies, ...this.devDependencies };
    return !!allDeps[pkg] && (!range || this.validateVersionInRange(allDeps[pkg], range));
  }

  private validateVersionInRange(versionSpec: string, requiredRange: string) {
    const cleanedVersionSpec = this.cleanVersionRange(versionSpec);
    const cleanedRequiredRange = this.cleanVersionRange(requiredRange);

    // Normalize / validate the required range first
    const validRequiredRange = validRange(cleanedRequiredRange);
    if (!validRequiredRange) {
      // If the requested range itself is invalid, we consider it not satisfied
      return false;
    }

    // Case 1: dependency spec is a concrete version (e.g. "1.2.3")
    const concreteVersion = valid(cleanedVersionSpec);
    if (concreteVersion) {
      return this.satisfies(concreteVersion, validRequiredRange);
    }

    // Case 2: dependency spec is itself a range (e.g. "^1.2.3", "~2.0", ">=1.0 <2.0")
    const depRange = validRange(cleanedVersionSpec);
    if (!depRange) {
      // Neither a valid version nor a valid range → treat as not satisfied
      return false;
    }

    // When both sides are ranges, check if they overlap
    return intersects(depRange, validRequiredRange, { includePrerelease: true });
  }

  private satisfies(version: string, range: string) {
    const v = this.cleanVersionRange(version);
    const r = this.cleanVersionRange(range);

    return satisfies(v, r, { includePrerelease: true });
  }

  private cleanVersionRange(version: string) {
    return version
      .trim()
      .replace(/v(\d+\.)/gi, "$1")
      .replace(/(^|\s+|\|\|)([^><]?)=(\d+\.)/g, "$1$2$3");
  }
}
