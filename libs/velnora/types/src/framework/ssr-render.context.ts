import type { RegisteredTemplate } from "../modules";
import type { Route } from "../router";

export interface SSRRenderContext {
  template: RegisteredTemplate;
  route: Route;
}
