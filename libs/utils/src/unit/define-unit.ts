/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { LiteralUnion } from "type-fest";

import type { Unit, UnitKind } from "@velnora/types";
import { type ConfigEnv } from "@velnora/types";

import type { WithConfigEnv } from "../types";

export const defineUnit = <TUnitKind extends UnitKind>(kind: TUnitKind) => {
  return <
    const TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
    const TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
    const TCapabilities extends (keyof Velnora.UnitRegistry)[]
  >(
    unit: WithConfigEnv<Omit<Unit<TUnitKind, TRequiredUnits, TOptionalUnits, TCapabilities>, "kind">>
  ): WithConfigEnv<Unit<TUnitKind, TRequiredUnits, TOptionalUnits, TCapabilities>> => {
    if (typeof unit === "function") {
      return (env: ConfigEnv): Unit<TUnitKind, TRequiredUnits, TOptionalUnits, TCapabilities> => {
        const unitDef = unit(env);
        return { ...unitDef, kind } as Unit<TUnitKind, TRequiredUnits, TOptionalUnits, TCapabilities>;
      };
    }
    return { ...unit, kind } as Unit<TUnitKind, TRequiredUnits, TOptionalUnits, TCapabilities>;
  };
};
