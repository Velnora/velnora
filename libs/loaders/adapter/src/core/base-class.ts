import { decoratorSettings } from "@fluxora/utils";

export class BaseClass<TParentClass> {
  declare protected parentClass: TParentClass;

  constructor(parentClass: TParentClass) {
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
