import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import type { Debugger } from "debug";
import type { Promisable } from "type-fest";

export abstract class Savable<TJson extends { toJSON: () => unknown }> {
  private isFirstInitialization = true;

  protected constructor(
    protected readonly manifestPath: string,
    protected readonly debug: Debugger
  ) {}

  protected abstract loadData(json: ReturnType<TJson["toJSON"]>): void;

  protected load() {
    const module = this.manifestPath;

    if (!existsSync(module)) {
      this.debug("load module graph cache not found at %O", { path: module });
      return;
    }

    const data = readFileSync(module, "utf-8");
    this.debug("loading module graph cache from %O", { path: module });

    const json = JSON.parse(data) as ReturnType<TJson["toJSON"]>;
    this.loadData(json);
  }

  protected save() {
    mkdirSync(dirname(this.manifestPath), { recursive: true });
    writeFileSync(this.manifestPath, JSON.stringify(this, null, 2), "utf-8");
  }

  protected clear() {
    if (existsSync(this.manifestPath)) {
      this.debug("clearing module graph cache at %O", { path: this.manifestPath });
      try {
        rmSync(this.manifestPath);
      } catch (err) {
        this.debug("failed to clear module graph cache at %O: %O", { path: this.manifestPath, err });
      }
    }
  }

  protected withPersistence<TReturn>(cb: () => TReturn): TReturn;
  protected withPersistence<TReturn>(cb: () => Promise<TReturn>): Promise<TReturn>;
  protected withPersistence<TReturn>(cb: () => Promisable<TReturn>): Promisable<TReturn> {
    if (this.isFirstInitialization) {
      this.isFirstInitialization = false;
      this.load();
    }
    const result = cb();
    if (result instanceof Promise) {
      return (result as Promise<TReturn>).then(res => {
        this.save();
        return res;
      });
    }

    this.save();
    return result;
  }
}
