import type { PageContext } from "./page.context";

export class BaseClassContext {
  constructor(protected readonly pageCtx: PageContext) {}

  checks() {}
}
