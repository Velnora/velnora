import type { DevEnvironment, RunnableDevEnvironment, ViteDevServer } from "vite";

import type { RegisteredTemplate } from "../modules";

export interface TemplateRenderContext {
  template: RegisteredTemplate;

  vite: ViteDevServer;
  client: DevEnvironment;
  server: RunnableDevEnvironment;

  getEntryFile(): string | undefined;
}
