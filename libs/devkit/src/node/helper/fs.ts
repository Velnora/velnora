import { readFileSync } from "fs";
import { readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { type GlobOptionsWithFileTypesFalse, glob } from "glob";

import type { FsApi, FsOptions } from "@velnora/types";

export class Fs implements FsApi {
  private lockedPaths: string[] = [];

  constructor(private readonly _root: string) {}

  get root() {
    return this.lockedPaths.length > 0 ? resolve(this._root, ...Array.from(this.lockedPaths)) : this._root;
  }

  exists(path?: string) {
    const pattern = path ? resolve(this.root, path) : this.root;
    const matches = glob.sync(pattern, { dot: true, nodir: false });
    return matches.length > 0;
  }

  stats(path?: string) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    return statSync(resolvedPath);
  }

  read(path?: string, options?: FsOptions) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    const encoding = options?.encoding || "utf-8";
    return readFileSync(resolvedPath, encoding);
  }

  readAsync(path?: string, options?: FsOptions) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    const encoding = options?.encoding || "utf-8";
    return readFile(resolvedPath, encoding);
  }

  write(contents: string, path?: string, options?: Pick<FsOptions, "encoding">) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    const encoding = options?.encoding || "utf-8";
    writeFileSync(resolvedPath, contents, { encoding });
  }

  async writeAsync(contents: string, path?: string, options?: FsOptions) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    const encoding = options?.encoding || "utf-8";
    await writeFile(resolvedPath, contents, { encoding });
  }

  readDir(path: string) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    return readdirSync(resolvedPath);
  }

  rm(path: string, options?: Pick<FsOptions, "force">) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    rmSync(resolvedPath, { recursive: true, force: options?.force || false });
  }

  async rmAsync(path: string, options?: Pick<FsOptions, "force">) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    await rm(resolvedPath, { recursive: true, force: options?.force || false });
  }

  pushd(path: string) {
    this.lockedPaths.push(path);
  }

  popd() {
    this.lockedPaths.pop();
  }

  resolve(...paths: string[]) {
    return paths.length ? resolve(this.root, ...paths) : this.root;
  }

  glob(pattern: string, options?: Omit<GlobOptionsWithFileTypesFalse, "cwd">) {
    return glob.sync(pattern, { ...options, cwd: this.root });
  }
}
