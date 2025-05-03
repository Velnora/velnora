export class BaseClass<TRawReturnType = {}> {
  declare protected isInitialized: boolean;
  declare protected initFunctions: Set<() => void>;

  constructor() {
    Object.defineProperties(this, {
      isInitialized: { enumerable: false, configurable: false, writable: true, value: false },
      initFunctions: { enumerable: false, configurable: false, writable: true, value: new Set() }
    });
  }

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

  afterInit(cb: () => void) {
    if (this.isInitialized) {
      return cb();
    }

    this.initFunctions.add(cb);
  }
}
