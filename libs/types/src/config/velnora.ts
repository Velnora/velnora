import type { VelnoraUnit } from "../unit";
import type { ConfigEnv } from "../utils";

/**
 * Workspace-level Velnora configuration.
 *
 * Defined in the root `velnora.config.ts` (or `.js` / `.json`) of the monorepo.
 * Controls global settings that apply to the entire workspace — such as
 * default ports, shared plugin registrations, or cross-project conventions.
 *
 * This is resolved once during `Kernel.init()` and made available to all
 * downstream consumers (adapters, plugins, CLI commands).
 */

export interface VelnoraConfig {
  integrations?: (VelnoraUnit | ((env: ConfigEnv) => VelnoraUnit))[];
}
