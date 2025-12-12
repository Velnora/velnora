import type { BaseRouteDescriptor } from "./base-route-descriptor";

export interface ClientRoute<TDescriptor extends BaseRouteDescriptor = BaseRouteDescriptor> {
  path: string;
  route: TDescriptor;
}
