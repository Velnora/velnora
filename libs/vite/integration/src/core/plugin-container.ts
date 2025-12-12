import type { PluginOption } from "vite";

export class PluginContainer {
  constructor(private readonly plugins: PluginOption) {}

  transformIndexHtml(html: string) {}
}
