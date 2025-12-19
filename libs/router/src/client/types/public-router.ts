export interface PublicRouter {
  navigate(target: string): void;
  replace(target: string): void;
  back(): void;
  forward(): void;
  reload(): void;
}
