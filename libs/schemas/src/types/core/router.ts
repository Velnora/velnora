import type { Package } from "../package";
import type { ParsedUrl } from "../parsed-url";
import type { Route, Routing } from "../router";

export interface Router {
  parse(url: string): ParsedUrl;
  getById(id: string): Route | undefined;
  withApp(this: Router, app: Package): Routing;
  inject(): Promise<void>;
}
