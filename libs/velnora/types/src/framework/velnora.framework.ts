import type { Promisable } from "type-fest";
import type { PluginOption } from "vite";

export interface VelnoraFramework {
  plugins: Promisable<PluginOption | PluginOption[]> | (() => Promisable<PluginOption | PluginOption[]>);
}
