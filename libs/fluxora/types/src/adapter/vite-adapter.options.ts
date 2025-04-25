import type { Promisable } from "type-fest";
import type { PluginOption, ServerOptions } from "vite";

export interface ViteAdapterOptions {
  server: ServerOptions;
  plugins: PluginOption | PluginOption[] | (() => Promisable<PluginOption | PluginOption[]>);
}
