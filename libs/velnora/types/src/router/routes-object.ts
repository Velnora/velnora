import type { Route } from "./route";

export interface RoutesObject extends Route {
  children?: RoutesObject[];
}
