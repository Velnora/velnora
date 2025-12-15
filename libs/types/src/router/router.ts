import type { Package } from "../package";
import type { ParsedUrl } from "./parsed-url";
import type { Route } from "./route";
import type { Routing } from "./routing";

export interface Router {
  parse(url: string): ParsedUrl;
  getById(id: string): Route | undefined;
  withApp(this: Router, app: Package): Routing;
  getRoutes(): Route[];
}
