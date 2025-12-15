import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

import type { Debugger } from "debug";

export abstract class Savable<TJson> {
  private isFirstInitialization = true;

  protected constructor(
    protected readonly manifestPath: string,
    protected readonly debug: Debugger
  ) {}

  protected abstract loadData(json: TJson): void;

  load() {
    const module = this.manifestPath;
    if (!existsSync(module)) {
      this.debug("load module graph cache not found at %O", { path: module });
      return;
    }

    const data = readFileSync(module, "utf-8");
    this.debug("loading module graph cache from %O", { path: module });

    const json = JSON.parse(data) as TJson;
    this.loadData(json);
  }

  save() {
    writeFileSync(this.manifestPath, JSON.stringify(this, null, 2), "utf-8");
  }

  clear() {
    if (existsSync(this.manifestPath)) {
      this.debug("clearing module graph cache at %O", { path: this.manifestPath });
      try {
        rmSync(this.manifestPath);
      } catch (err) {
        this.debug("failed to clear module graph cache at %O: %O", { path: this.manifestPath, err });
      }
    }
  }

  protected withPersistence<TReturn>(cb: () => TReturn): TReturn {
    if (this.isFirstInitialization) {
      this.isFirstInitialization = false;
      this.load();
    }
    const result = cb();
    this.save();
    return result;
  }
}
