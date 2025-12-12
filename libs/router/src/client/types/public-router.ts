export interface PublicRouter {
  readonly path: string;

  getPath(path: string): string;
  push(path: string): void;
  replace(path: string): void;
}
