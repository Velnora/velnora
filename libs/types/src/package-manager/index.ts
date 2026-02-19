/**
 * Package-manager abstraction layer.
 *
 * Exports a runtime-agnostic {@link PackageManager} interface and all
 * supporting types needed to install, query, mutate, and audit project
 * dependencies across different ecosystems (npm, maven, nuget, cargo, etc.).
 *
 * @module
 */

export * from "./add-options";
export * from "./audit-result";
export * from "./dependency";
export * from "./depdendency-scope";
export * from "./dependency-tree";
export * from "./install-options";
export * from "./outdated-result";
export * from "./package-manager";
export * from "./resolved-dependency";
export * from "./vulnerability";
