/**
 * @velnora-meta
 * type: author
 * project: Velnora
 * author: MDReal
 * package: @velnora/types
 * layer: core
 * visibility: public
 */

/**
 * Runtime toolchain types.
 *
 * This module exports every interface related to the runtime toolchain
 * abstraction -- from the top-level {@link Toolchain} contract down to
 * the individual result types produced by each lifecycle step.
 *
 * @module
 */

export * from "./compile-result";
export * from "./execute-options";
export * from "./process-handle";
export * from "./resolved-toolchain";
export * from "./test-result-suite";
export * from "./test-result";
export * from "./toolchain-context";
export * from "./toolchain-features";
export * from "./toolchain-process";
export * from "./toolchain";
