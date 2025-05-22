import { BaseClass as RootBaseClass, decoratorSettings } from "@velnora/utils";

export class BaseClass<TParent> extends RootBaseClass {
  declare parent: TParent;

  constructor(parent: TParent) {
    super();
    Object.defineProperty(this, "parent", {
      value: parent,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

decoratorSettings.registerBaseClass(BaseClass, (instance, Class) => {
  return new Class(instance);
});
