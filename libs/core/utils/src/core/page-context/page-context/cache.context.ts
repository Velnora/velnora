import { resolve } from "node:path";

import { BaseClassContext } from "../base-class.context";

export class CacheContext extends BaseClassContext {
  get root() {
    return resolve(this.pageCtx.userConfig.cache?.root || ".fluxora");
  }
}
