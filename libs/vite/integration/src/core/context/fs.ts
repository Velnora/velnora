import { readFileSync } from "fs";
import { readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { type GlobOptionsWithFileTypesFalse, glob } from "glob";

import type { FsApi, FsOptions, Package } from "@velnora/schemas";

export class Fs implements FsApi {
  private lockedPaths = new Set<string>();

  constructor(private readonly pkg: Package) {}

  private get root() {
    return this.lockedPaths.size > 0 ? resolve(this.pkg.root, ...Array.from(this.lockedPaths)) : this.pkg.root;
  }

  exists(path?: string) {
    const pattern = path ? resolve(this.root, path) : this.root;
    const matches = glob.sync(pattern, { dot: true, nodir: false });
    return matches.length > 0;
  }

  read(path?: string, options?: FsOptions) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    const encoding = options?.encoding || "utf-8";
    return readFileSync(resolvedPath, encoding);
  }

  write(contents: string, path?: string, options?: Pick<FsOptions, "encoding">) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    const encoding = options?.encoding || "utf-8";
    writeFileSync(resolvedPath, contents, { encoding });
  }

  readDir(path: string) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    return readdirSync(resolvedPath);
  }

  pushd(path: string) {
    this.lockedPaths.add(path);
  }

  popd() {
    this.lockedPaths.delete(Array.from(this.lockedPaths).pop()!);
  }

  file(path: string) {
    return path ? resolve(this.root, path) : this.root;
  }

  glob(pattern: string, path?: string, options?: Omit<GlobOptionsWithFileTypesFalse, "cwd">) {
    const resolvedPath = path ? resolve(this.root, path) : this.root;
    return glob.sync(pattern, { ...options, cwd: resolvedPath });
  }
}
