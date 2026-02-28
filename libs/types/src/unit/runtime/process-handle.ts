/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * A lightweight reference to a running toolchain process.
 *
 * Returned by {@link Toolchain.execute} (wrapped in a
 * {@link ToolchainProcess}) so callers can track or signal the child
 * process without holding a direct handle to it.
 */
export interface ProcessHandle {
  /** Operating-system process identifier. */
  pid: number;

  /**
   * TCP port the process is listening on, if applicable.
   *
   * May differ from the {@link ExecuteOptions.port} that was requested when
   * the preferred port was already in use.
   */
  port?: number;
}
