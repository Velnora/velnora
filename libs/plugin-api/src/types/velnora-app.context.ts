import type { Env } from "./env";
import type { Logger } from "./logger";
import type { RenderHints } from "./render-hints";
import type { ResourceRegistry } from "./resource-registry";
import type { Telemetry } from "./telemetry";

export interface VelnoraAppContext {
  /** Stable id for the app/workspace/site. */
  appId: string;

  /** End-user locale for i18n plugins. */
  locale?: string;

  /** Current runtime environment (dev/prod/test). */
  runtimeEnv: Env;

  /** Environment variables / flags applicable to this render or build run. */
  env?: Record<string, string>;

  /** Abort the current build/render if needed. */
  abort?: AbortSignal;

  /** Structured logging (optional). */
  logger?: Logger;

  /** Perf/tracing hooks (optional). */
  telemetry?: Telemetry;

  /** Shared resources discoverable by plugins/adapters. */
  resources?: ResourceRegistry;

  /** Target adapter id (e.g., "react-dom", "ratatui", "cli"). */
  renderTarget?: string;

  /** Fine-grained hints for the renderer/adapter. */
  renderHints?: Partial<RenderHints>;
}
