/**
 * Represents a build output artifact produced by a toolchain's packaging step.
 *
 * When the kernel invokes {@link Toolchain.package}, the toolchain compiles and
 * bundles the project into one or more distributable files. Each file is
 * described by an `Artifact` record that carries its location on disk, its
 * format, and (optionally) its size.
 *
 * @example
 * ```typescript
 * const artifact: Artifact = {
 *   path: "/dist/my-service/my-service-1.0.0.tgz",
 *   type: "tgz",
 *   size: 204_800,
 * };
 * ```
 *
 * @see Toolchain.package — the lifecycle hook that produces `Artifact` records.
 */
export interface Artifact {
  /** Absolute file-system path to the produced artifact. */
  path: string;

  /**
   * Format identifier that describes the artifact's packaging type.
   *
   * Common values include `"jar"`, `"dll"`, `"binary"`, and `"tgz"`, but
   * toolchains may emit any string that is meaningful to downstream consumers.
   */
  type: string;

  /**
   * File size of the artifact in bytes.
   *
   * When present, this can be used for reporting, size-budget checks, or
   * upload-progress estimation. Toolchains that cannot determine the size
   * ahead of time may omit this field.
   */
  size?: number;
}
