import type { LiteralUnion } from "type-fest";

import type { Project } from "../../project";
import type { AdapterBuildContext } from "../adapter/adapter-build-context";
import type { AdapterDevContext } from "../adapter/adapter-dev-context";
import type { DevServerResult } from "../adapter/dev-server-result";
import type { BaseUnit } from "./base-unit";
import type { UnitKind } from "./unit-kind";

export interface AdapterUnit<
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TCapabilities extends (keyof Velnora.UnitRegistry)[]
> extends BaseUnit<TRequiredUnits, TOptionalUnits, TCapabilities> {
  kind: UnitKind.ADAPTER;
  dev(
    project: Project,
    ctx: AdapterDevContext<TRequiredUnits, TOptionalUnits, TCapabilities>
  ): Promise<DevServerResult>;
  build(project: Project, ctx: AdapterBuildContext<TRequiredUnits, TOptionalUnits, TCapabilities>): Promise<void>;
}
