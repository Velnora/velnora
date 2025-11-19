import type { AppGraph } from "./app-graph";
import type { HookResult } from "./hook-result";
import type { PluginMeta } from "./plugin-meta";
import type { VelnoraAppContext } from "./velnora-app.context";

export interface VelnoraPlugin extends PluginMeta {
  /**
   * Accept upstream config and return normalized config (or a promise).
   * Think "merge + validate". Runs once at build start.
   */
  config?(c: Record<string, unknown>): Record<string, unknown> | Promise<Record<string, unknown>>;

  /**
   * Let the plugin inspect/modify the discovered graph (routes, pages, layouts).
   * This is the best place to register virtual routes, inject heads, or annotate nodes.
   */
  resolve?(graph: AppGraph, ctx: VelnoraAppContext): HookResult;

  /** Called once when build starts (dev server boot or production build). */
  buildStart?(ctx: VelnoraAppContext): HookResult;

  /** Called in the runtime just before the renderer initializes. */
  runtimeInit?(ctx: VelnoraAppContext): HookResult;

  /** Called right before the root tree is mounted/committed. */
  beforeMount?(ctx: VelnoraAppContext): HookResult;

  /** Called right after the root tree is mounted/committed. */
  afterMount?(ctx: VelnoraAppContext): HookResult;

  /** Called when shutting down the runtime (dev server close, process exit). */
  shutdown?(ctx: VelnoraAppContext): HookResult;
}
