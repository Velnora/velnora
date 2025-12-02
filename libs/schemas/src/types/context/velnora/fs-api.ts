import type { GlobOptionsWithFileTypesFalse } from "glob";

export interface FsOptions {
  encoding?: BufferEncoding;
  force?: boolean;
}

export interface FsApi {
  exists(path?: string): boolean;
  read(path?: string, options?: FsOptions): string;
  write(contents: string, path?: string, options?: FsOptions): void;
  readDir(path?: string): string[];

  resolve(path: string): string;

  pushd(path: string): void;
  popd(): void;

  glob(pattern: string, path?: string, options?: Omit<GlobOptionsWithFileTypesFalse, "cwd">): string[];
}
