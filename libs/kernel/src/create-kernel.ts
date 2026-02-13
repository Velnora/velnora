import { Kernel } from "./kernel";

/**
 * Factory function for quick Kernel instantiation.
 *
 * @example
 * ```typescript
 * const kernel = createKernel();
 * await kernel.init();
 * await kernel.bootHost({ port: 3000 });
 * ```
 */
export const createKernel = (): Kernel => new Kernel();
