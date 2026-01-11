import type { Stats } from "node:fs";

import type { GlobOptionsWithFileTypesFalse } from "glob";

export interface FsOptions {
  encoding?: BufferEncoding;
  force?: boolean;
}

export interface FsApi {
  readonly root: string;

  exists(path?: string): boolean;
  stats(path?: string): Stats;

  read(path?: string, options?: FsOptions): string;
  readAsync(path?: string, options?: FsOptions): Promise<string>;

  createDir(path: string, options?: Pick<FsOptions, "force">): void;
  createDirAsync(path: string, options?: Pick<FsOptions, "force">): Promise<void>;

  write(contents: string, path?: string, options?: FsOptions): void;
  writeAsync(contents: string, path?: string, options?: FsOptions): Promise<void>;
  readDir(path?: string): string[];

  rm(path: string, options?: Pick<FsOptions, "force">): void;
  rmAsync(path: string, options?: Pick<FsOptions, "force">): Promise<void>;

  resolve(...paths: string[]): string;

  pushd(path: string): void;
  popd(): void;

  glob(pattern: string, options?: Omit<GlobOptionsWithFileTypesFalse, "cwd">): string[];
}
