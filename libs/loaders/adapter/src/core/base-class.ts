import { BaseClass as RootBaseClass, decoratorSettings } from "@fluxora/utils";

export class BaseClass<TParentClass> extends RootBaseClass {
  declare parentClass: TParentClass;

  constructor(parentClass: TParentClass) {
    super();
    Object.defineProperty(this, "parentClass", {
      value: parentClass,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }

  checks() {}
}

decoratorSettings.registerBaseClass(BaseClass, (instance, Class) => {
  return new Class(instance);
});
