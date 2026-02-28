/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */

/**
 * Global `Velnora` namespace used as the **declaration-merging** entry point
 * for the entire type system.
 *
 * Consumers (runtime packages, plugins, integrations) can extend this
 * namespace by re-declaring it in their own ambient `.d.ts` files. TypeScript
 * merges every declaration with the same name into a single namespace, so new
 * properties and sub-namespaces appear automatically without modifying this
 * file.
 *
 * @example Extending from a runtime package
 * ```typescript
 * // in @velnora/runtime-node/types.d.ts
 * declare namespace Velnora {
 *   namespace Toolchain {
 *     interface Features {
 *       nativeModules: boolean;
 *       esm: boolean;
 *     }
 *   }
 * }
 * ```
 *
 * Because `ToolchainFeatures` in `@velnora/types` extends
 * `Velnora.Toolchain.Features`, any keys added here are picked up across the
 * entire workspace with no additional imports.
 */

declare namespace Velnora {
  /**
   * Sub-namespace for toolchain-related declaration merging.
   *
   * Runtime unit authors augment the interfaces inside this namespace to
   * advertise which toolchain capabilities their runtime supports.
   */
  namespace Toolchain {
    /**
     * Open interface that runtime packages augment via declaration merging to
     * describe the set of toolchain features they provide.
     *
     * On its own this interface is intentionally empty. When a runtime package
     * re-declares `Velnora.Toolchain.Features` with concrete keys, TypeScript
     * merges them into this interface, and the `ToolchainFeatures` type alias
     * (which extends this interface) picks them up automatically.
     *
     * @example
     * ```typescript
     * declare namespace Velnora {
     *   namespace Toolchain {
     *     interface Features {
     *       hotReload: boolean;
     *     }
     *   }
     * }
     * ```
     */
    interface Features {}
  }

  /**
   * Open interface that integration units use to register and discover
   * public APIs via {@link UnitContext.expose} and {@link UnitContext.query}.
   *
   * Augment this interface in each integration package to declare the APIs
   * it provides. TypeScript's declaration merging ensures the keys are
   * visible across the entire workspace.
   *
   * @example
   * ```typescript
   * declare namespace Velnora {
   *   interface UnitRegistry {
   *     "react-dom": { hydrate(el: HTMLElement): void };
   *   }
   * }
   * ```
   */
  interface UnitRegistry {}
}
