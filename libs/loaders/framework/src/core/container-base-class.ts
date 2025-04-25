import { decoratorSettings } from "@fluxora/utils";

export class ContainerBaseClass<TParent> {
  declare parent: TParent;

  constructor(parent: TParent) {
    Object.defineProperty(this, "parent", {
      value: parent,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

decoratorSettings.registerBaseClass(ContainerBaseClass, (instance, ContainerBaseClass) => {
  return new ContainerBaseClass(instance);
});
