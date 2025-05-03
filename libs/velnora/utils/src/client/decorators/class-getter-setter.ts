import { CLASS_METHOD_DATA, CLASS_PROPS_SET } from "../../const";

type Hook = (this: any, value: any) => any;
export const ClassGetterSetter = (defaultValue?: any, ...hooks: Hook[]): PropertyDecorator => {
  return (target, propertyKey) => {
    if (typeof propertyKey === "string") {
      const hookValue = (value: any) => {
        for (const hook of hooks) value = hook.bind(this)(value) ?? value;
        return value;
      };

      const prop = `_${propertyKey}`;
      const initialValue = (target as any)[prop] ?? hookValue(defaultValue);

      Object.defineProperty(target, prop, {
        enumerable: true,
        writable: true,
        configurable: true,
        value: initialValue
      });
    } else {
      throw new Error(`Property key must be a string, but got ${typeof propertyKey}`);
    }

    Reflect.defineMetadata(CLASS_METHOD_DATA, [propertyKey, hooks], target, propertyKey);

    let proto = target;
    let keys: Set<string | symbol> | undefined;

    while (proto) {
      keys = Reflect.getOwnMetadata(CLASS_PROPS_SET, proto);
      if (keys) {
        keys = new Set(keys);
        break;
      }
      proto = Object.getPrototypeOf(proto);
    }

    keys ??= new Set();
    keys.add(propertyKey);
    Reflect.defineMetadata(CLASS_PROPS_SET, keys, target);
  };
};
