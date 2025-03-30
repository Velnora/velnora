import { resolve } from "node:path";

import { BaseClassContext } from "../../base-class.context";

export class TemplateContext extends BaseClassContext {
  get path() {
    return resolve(this.pageCtx.userConfig.projectStructure?.template?.path || "template");
  }
}
