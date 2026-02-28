/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * Configuration passed to {@link Toolchain.execute} to control how a
 * project is run.
 *
 * Every property is optional so callers can supply only the overrides they
 * care about; the toolchain implementation fills in sensible defaults for
 * the rest.
 */
export interface ExecuteOptions {
  /** CLI arguments passed to the binary (e.g. `["--inspect", "--harmony"]`). */
  args?: string[];

  /**
   * Additional environment variables merged into the child process's env.
   *
   * Existing variables with the same key are overwritten.
   */
  env?: Record<string, string>;

  /**
   * Preferred TCP port for the running process to listen on.
   *
   * When omitted, the runtime picks an available port automatically.
   */
  port?: number;

  /**
   * Enable file-watching / hot-reload mode if the toolchain supports it.
   *
   * @defaultValue `false`
   */
  watch?: boolean;
}
