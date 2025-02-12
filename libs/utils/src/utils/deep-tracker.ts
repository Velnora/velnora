import { EventEmitter } from "node:events";

import { logger } from "./logger";

interface Events {
  change: [string, any];
  delete: [string, any];
}

const valueSymbol = Symbol("value");

export class DeepTracker<TObject> extends EventEmitter<Events> {
  private proxies = new WeakMap<object, object>();
  private _proxyObject: TObject = null!;

  constructor(object: TObject) {
    super();
    this.setObject(object);
  }

  proxy() {
    return this._proxyObject;
  }

  set(path: string, value: any) {
    if (!path.startsWith("$.")) {
      logger.error(`Path must start with "$."`);
      process.exit(1);
    }

    const parts = this.parsePath(path.slice(2));
    let obj: any = this._proxyObject;

    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (typeof obj[key] !== "object" || obj[key] === null) obj[key] = {};
      obj = obj[key];
    }

    obj[parts[parts.length - 1]] = { [valueSymbol]: value, noTrigger: true };
  }

  setObject(object: TObject) {
    this._proxyObject = this.createProxy(object, "$");
  }

  delete(path: string) {
    const parts = this.parsePath(path);
    let obj: any = this._proxyObject;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in obj)) return;
      obj = obj[parts[i]];
    }

    delete obj[parts[parts.length - 1]];
  }

  private createProxy(target: any, path: string): any {
    if (typeof target !== "object" || target === null) return target;

    if (this.proxies.has(target)) return this.proxies.get(target);

    const handler: ProxyHandler<any> = {
      get: (obj, prop, receiver) => {
        const value = Reflect.get(obj, prop, receiver);
        return typeof value === "object"
          ? this.createProxy(value, `${path}.${String(prop)}`.replace(/^\./, ""))
          : value;
      },

      set: (obj, prop, value, receiver) => {
        const isInternalCall = !!value[valueSymbol];
        const val = isInternalCall ? value[valueSymbol] : value;

        const oldValue = Reflect.get(obj, prop, receiver);
        if (oldValue !== val) {
          const property = String(prop);
          const pathSegment = property.includes(".") ? `[${property}]` : `.${property}`;
          const fullPath = `${path}${pathSegment}`.replace(/^\./, "");
          Reflect.set(obj, prop, val, receiver);
          !value.noTrigger && this.emit("change", fullPath, value);
        }
        return true;
      },

      deleteProperty: (obj, prop) => {
        const fullPath = `${path}.${String(prop)}`.replace(/^\./, "");
        const oldValue = Reflect.get(obj, prop);
        const success = Reflect.deleteProperty(obj, prop);
        if (success) {
          this.emit("delete", fullPath, oldValue);
        }
        return success;
      }
    };

    const proxy = new Proxy(target, handler);
    this.proxies.set(target, proxy);
    return proxy;
  }

  private parsePath(path: string): string[] {
    const regex = /[^.\[\]]+|\[([^\[\]]+)]/g;
    return [...path.matchAll(regex)].map(match => match[1] || match[0]);
  }
}
