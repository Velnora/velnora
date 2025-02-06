import { resolve } from "node:path";

import { App } from "@fluxora/common";
import type { MicroTemplate } from "@fluxora/types/core";
import { getTemplateConfiguration } from "@fluxora/vite";

export class TemplateApp extends App {
  constructor(protected readonly app: MicroTemplate) {
    super(app);
  }

  private _buildOutput: string | undefined;

  get buildOutput() {
    return this._buildOutput;
  }

  viteConfig() {
    return getTemplateConfiguration(this.app);
  }

  async build() {
    const viteConfig = await this.viteConfig();
    const output = await super.build();
    if (Array.isArray(output)) {
      const fileName = output[0].output[0].fileName;
      this._buildOutput = resolve(viteConfig.build!.outDir!, fileName);
    }
  }
}
