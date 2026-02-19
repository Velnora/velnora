/**
 * A handle to a long-running toolchain operation.
 *
 * Every lifecycle method on {@link Toolchain} (`compile`, `execute`,
 * `test`, `package`) returns a `ToolchainProcess` whose generic
 * parameter `T` indicates the shape of the final result. Callers can
 * stream incremental output via {@link stdout}/{@link stderr} and
 * `await` the {@link result} promise for the finished value.
 *
 * @typeParam T - The result type produced when the operation completes
 *   (e.g. {@link CompileResult}, {@link ProcessHandle}, {@link TestResult},
 *   {@link Artifact}).
 */
export interface ToolchainProcess<T> {
  /**
   * Readable stream of the process's standard output.
   *
   * Typically piped to the Velnora logger or CLI output.
   */
  stdout: ReadableStream<string>;

  /**
   * Readable stream of the process's standard error.
   *
   * Contains compiler warnings, runtime diagnostics, and similar messages.
   */
  stderr: ReadableStream<string>;

  /**
   * Promise that resolves with the operation's result once the underlying
   * process exits.
   *
   * For long-running servers started via `execute`, this resolves only
   * after the server is explicitly stopped via {@link kill}.
   */
  result: Promise<T>;

  /**
   * Sends a termination signal to the underlying process and waits for
   * it to exit cleanly.
   *
   * Resolves once the process has fully shut down. Subsequent calls are
   * safe and resolve immediately.
   */
  kill(): Promise<void>;
}
