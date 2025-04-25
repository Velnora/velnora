import { BaseClass as RootBaseClass, decoratorSettings } from "@fluxora/utils";

import { AppContext } from "./app.context";

export class BaseClass extends RootBaseClass {
  declare protected appCtx: AppContext;

  constructor(appCtx: AppContext) {
    super();
    Object.defineProperty(this, "appCtx", {
      enumerable: false,
      writable: false,
      configurable: false,
      value: appCtx
    });
  }
}

decoratorSettings.registerBaseClass(BaseClass, (instance, BaseClass) => {
  const appCtx = instance.appCtx || instance;
  if (!appCtx) throw new Error("AppContext is not defined");
  return new BaseClass(appCtx);
});
