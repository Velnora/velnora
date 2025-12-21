import { resolve } from "node:path";

import type { Debugger } from "debug";
import type { Promisable } from "type-fest";

import type { FsApi } from "@velnora/types";

import { Fs, globals } from "../helper";

export abstract class Savable<TJson extends { toJSON: () => unknown }> {
  protected readonly fs: FsApi;
  private isFirstInitialization = true;

  protected constructor(
    protected readonly manifestPath: string,
    protected readonly debug: Debugger
  ) {
    const config = globals.get("config");
    this.fs = new Fs(resolve(config?.root ?? process.cwd(), config.cacheDir));
  }

  protected abstract fromJSON(json: ReturnType<TJson["toJSON"]>): void;

  protected load(force = false) {
    if (!this.isFirstInitialization && !force) return;
    this.isFirstInitialization = false;

    if (!this.fs.exists(this.manifestPath)) {
      this.debug("load module graph cache not found at %O", { path: module });
      return;
    }

    const data = this.fs.read(this.manifestPath);
    this.debug("loading module graph cache from %O", { path: module });

    const json = JSON.parse(data) as ReturnType<TJson["toJSON"]>;
    this.fromJSON(json);
  }

  protected async loadAsync(force = false) {
    if (!this.isFirstInitialization && !force) return;
    this.isFirstInitialization = false;

    if (!this.fs.exists(this.manifestPath)) {
      this.debug("load module graph cache not found at %O", { path: module });
      return;
    }

    const data = await this.fs.readAsync(this.manifestPath);
    this.debug("loading module graph cache from %O", { path: module });

    const json = JSON.parse(data) as ReturnType<TJson["toJSON"]>;
    this.fromJSON(json);
  }

  protected save() {
    this.fs.write(JSON.stringify(this, null, 2), this.manifestPath);
  }

  protected async saveAsync() {
    await this.fs.writeAsync(JSON.stringify(this, null, 2), this.manifestPath);
  }

  protected clear() {
    if (this.fs.exists(this.manifestPath)) {
      this.debug("clearing module graph cache at %O", { path: this.manifestPath });
      try {
        this.fs.rm(this.manifestPath);
      } catch (err) {
        this.debug("failed to clear module graph cache at %O: %O", { path: this.manifestPath, err });
      }
    }
  }

  protected async clearAsync() {
    if (this.fs.exists(this.manifestPath)) {
      this.debug("clearing module graph cache at %O", { path: this.manifestPath });
      try {
        await this.fs.rmAsync(this.manifestPath);
      } catch (err) {
        this.debug("failed to clear module graph cache at %O: %O", { path: this.manifestPath, err });
      }
    }
  }

  protected withPersistence<TReturn>(cb: () => TReturn): TReturn;
  protected withPersistence<TReturn>(cb: () => Promise<TReturn>): Promise<TReturn>;
  protected withPersistence<TReturn>(cb: () => Promisable<TReturn>): Promisable<TReturn> {
    this.load();
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

  protected withPersistenceAsync<TReturn>(cb: () => TReturn): Promise<TReturn>;
  protected withPersistenceAsync<TReturn>(cb: () => Promise<TReturn>): Promise<TReturn>;
  protected async withPersistenceAsync<TReturn>(cb: () => Promisable<TReturn>): Promise<TReturn> {
    await this.loadAsync();
    const result = cb();
    await this.saveAsync();
    return result;
  }
}
