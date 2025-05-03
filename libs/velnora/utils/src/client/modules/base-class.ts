export class BaseClass<TRawReturnType = {}> {
  constructor() {}

  checks() {}

  raw() {
    return {} as TRawReturnType;
  }

  __getSuperPrototype(key: string | symbol) {
    let proto = this;

    while (proto) {
      const value = Reflect.getOwnMetadata(key, proto);
      if (value) break;
      proto = Object.getPrototypeOf(proto);
    }
    return proto;
  }
}
