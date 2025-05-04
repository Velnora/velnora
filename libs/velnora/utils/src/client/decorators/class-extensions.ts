import type { Type } from "@nestjs/common";

import { CLASS_METHOD_DATA, CLASS_PROPS_SET } from "../../const";
import { BaseClass } from "../modules";
import { isClass } from "../utils";
import { logger } from "../utils/logger";
import { decoratorSettings } from "./decorator.settings";

export const ClassExtensions = (): ClassDecorator => {
  return Target => {
    const OldTarget = Target as unknown as Type<BaseClass>;
    class InternalTarget extends OldTarget {
      constructor(...args: any[]) {
        super(...args);

        if (!("__getSuperPrototype" in this)) {
          logger.error(`Class "${Target.name}" must be extended from BaseClass. Otherwise, it won't work as expected.`);
          process.exit(1);
        }

        const keysSet = (Reflect.getMetadata(CLASS_PROPS_SET, this) ?? new Set()) as Set<string>;
        const keys = Array.from(keysSet);

        keys
          .map<[string, ((this: any, value: any) => any)[]]>(key => Reflect.getMetadata(CLASS_METHOD_DATA, this, key))
          .forEach(([prop, hooks]) => {
            const hookValue = (value: any) => {
              for (const hook of hooks) value = hook.bind(this)(value) ?? value;
              return value;
            };

            const Class = Reflect.getMetadata("design:type", this, prop);
            const baseClassHandler = decoratorSettings.getBaseClass(Class);

            Object.defineProperty(this, prop, {
              enumerable: false,
              configurable: true,
              get() {
                if (baseClassHandler && !this[`_${prop}`]) {
                  const value = baseClassHandler(this);
                  logger.debug(`Creating new instance of ${Class.name} for ${this.constructor.name}.${prop}`, value);
                  this[`_${prop}`] = value;
                }

                if ([Set, Map].includes(Class as any) && !this[`_${prop}`]) {
                  this[`_${prop}`] = new Class();
                }

                if (isClass(Class) && !this[`_${prop}`]) {
                  logger.debug("Creating new instance of class", Class.name);
                  this[`_${prop}`] = new Class();
                }

                return this[`_${prop}`];
              },
              set(value) {
                if (baseClassHandler) {
                  Object.assign(this[prop], hookValue(value));
                  return;
                }

                this[`_${prop}`] = hookValue(value);
              }
            });
          });

        this.isInitialized = true;
        this.initFunctions.forEach(fn => fn.call(this));
        this.initFunctions.clear();
      }

      override checks() {
        super.checks();

        const proto = this.__getSuperPrototype(CLASS_PROPS_SET);
        Array.from((Reflect.getOwnMetadata(CLASS_PROPS_SET, proto) ?? new Set()) as Set<string>)
          .map(key => [key, Reflect.getMetadata("design:type", this, key)])
          .map(([key, Class]) => {
            const baseClassHandler = decoratorSettings.getBaseClass(Class);
            if (baseClassHandler) (this as any)[key].checks();
          });
      }
    }

    Object.defineProperty(InternalTarget, "name", { value: `CE(${Target.name})` });
    return InternalTarget as any;
  };
};
