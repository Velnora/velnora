import { CLASS_METHOD_DATA, CLASS_PROPS_SET } from "../../const";

type Hook = (this: any, value: any) => any;
export const ClassGetterSetter = (defaultValue?: any, ...hooks: Hook[]): PropertyDecorator => {
  return (target, propertyKey) => {
    Reflect.defineMetadata(CLASS_METHOD_DATA, [propertyKey, hooks, defaultValue], target, propertyKey);

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
