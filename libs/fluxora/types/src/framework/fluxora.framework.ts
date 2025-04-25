import type { Promisable } from "type-fest";
import type { PluginOption } from "vite";

export interface FluxoraFramework {
  plugins: Promisable<PluginOption | PluginOption[]> | (() => Promisable<PluginOption | PluginOption[]>);
}
