import type { Type } from "@nestjs/common";

import { CLASS_PROPS_SET } from "../../const";
import type { BaseClass } from "../modules";
import { decoratorSettings } from "./decorator.settings";

export const ClassRawValues = (): ClassDecorator => {
  return Target => {
    const OldTarget = Target as any as Type<BaseClass>;
    class InternalTarget extends OldTarget {
      constructor(...args: any[]) {
        super(...args);
      }

      raw() {
        const rawValues = super.raw();
        if (rawValues && typeof rawValues !== "object") throw new Error("Raw values must be an object");
        const values: Record<string, any> = { ...(rawValues || {}) };

        const proto = this.__getSuperPrototype(CLASS_PROPS_SET);
        Array.from((Reflect.getOwnMetadata(CLASS_PROPS_SET, proto) ?? new Set()) as Set<string>)
          .map(key => [key, Reflect.getMetadata("design:type", this, key)])
          .map(([key, Class]) => {
            const baseClassHandler = decoratorSettings.getBaseClass(Class);
            const value = (this as any)[key];
            values[key] = baseClassHandler ? value.raw() : value;
          });

        return values;
      }
    }

    Object.defineProperty(InternalTarget, "name", { value: `CRV(${Target.name})` });
    return InternalTarget as any;
  };
};
