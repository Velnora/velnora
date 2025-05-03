import type { RegisteredApp, RegisteredTemplate } from "../modules";
import type { Route } from "../router";

export interface SSRRenderContext {
  app: RegisteredApp;
  template: RegisteredTemplate;
  route: Route;
}
