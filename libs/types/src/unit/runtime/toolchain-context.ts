/**
 * Ambient context passed to {@link Toolchain.resolve}.
 *
 * Contains environmental information the toolchain needs in order to
 * locate and validate its binary. Additional fields (e.g. resolved
 * configuration, logger) will be added as the runtime layer matures.
 */
export interface ToolchainContext {
  /** Absolute path to the working directory of the project being resolved. */
  cwd: string;
  // ToDo: Implement these later when we have a better idea of what the toolchain needs to know about the project and the environment
  // config: ResolvedConfig;
  // logger: Logger;
}
