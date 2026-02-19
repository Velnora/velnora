/**
 * The outcome of a toolchain compilation step.
 *
 * Returned inside a {@link ToolchainProcess} when {@link Toolchain.compile}
 * finishes. Consumers should inspect {@link success} before accessing
 * {@link outputDir}; when `success` is `false`, {@link errors} will contain
 * one or more diagnostic messages from the underlying compiler.
 */
export interface CompileResult {
  /** Whether the compilation completed without errors. */
  success: boolean;

  /**
   * Absolute path to the directory that contains the build output
   * (e.g. `dist/`, `target/classes/`, `bin/Release/`).
   */
  outputDir: string;

  /**
   * Diagnostic error messages emitted by the compiler on failure.
   *
   * Only populated when {@link success} is `false`. Each entry typically
   * corresponds to a single compiler diagnostic.
   */
  errors?: string[];
}
