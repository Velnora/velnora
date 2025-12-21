import type { ValueOf } from "type-fest";

import type { VelnoraConfig } from "@velnora/types";

class Globals<TObject> extends Map<keyof TObject, ValueOf<TObject>> {
  getSilent<TKey extends keyof TObject>(key: TKey) {
    return super.get(key);
  }

  get<TKey extends keyof TObject>(key: TKey) {
    const value = this.getSilent(key);
    if (!value) throw new Error(`Global value for key "${String(key)}" is not set.`);
    return value;
  }

  set<TKey extends keyof TObject>(key: TKey, value: TObject[TKey]) {
    return super.set(key, value);
  }
}

interface GlobalValues {
  config: VelnoraConfig;
}

export const globals = new Globals<GlobalValues>();
