import type { Type } from "@nestjs/common";

import { isSubclassOf, singleton } from "../utils";

class DecoratorSettings {
  private readonly classes = new Map<any, (instance: any, Class: Type) => any>();

  registerBaseClass(cls: Type, handler?: (instance: any, Class: Type) => any) {
    if (this.classes.has(cls)) {
      throw new Error(`Class "${cls.name}" is already registered.`);
    }
    this.classes.set(cls, (handler || ((_: any, Class: Type) => new Class())) as any);
  }

  getBaseClass(Class: Type) {
    const handler = Array.from(this.classes.entries()).find(([RegisteredClass]) =>
      isSubclassOf(Class, RegisteredClass)
    );
    if (!handler) return;
    return (instance: any) => handler[1](instance, Class);
  }
}

export const decoratorSettings = singleton("__FLUXORA_DECORATOR_SETTINGS__", () => new DecoratorSettings());
