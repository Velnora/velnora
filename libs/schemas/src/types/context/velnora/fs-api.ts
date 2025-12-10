import type { GlobOptionsWithFileTypesFalse } from "glob";

export interface FsOptions {
  encoding?: BufferEncoding;
  force?: boolean;
}

export interface FsApi {
  readonly root: string;

  exists(path?: string): boolean;
  read(path?: string, options?: FsOptions): string;
  write(contents: string, path?: string, options?: FsOptions): void;
  readDir(path?: string): string[];

  resolve(...paths: string[]): string;

  pushd(path: string): void;
  popd(): void;

  glob(pattern: string, options?: Omit<GlobOptionsWithFileTypesFalse, "cwd">): string[];
}
