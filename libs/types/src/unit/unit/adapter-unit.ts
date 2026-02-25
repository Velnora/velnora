import type { Project } from "../../project";
import type { AdapterBuildContext } from "../adapter/adapter-build-context";
import type { AdapterDevContext } from "../adapter/adapter-dev-context";
import type { DevServerResult } from "../adapter/dev-server-result";
import type { BaseUnit } from "./base-unit";
import type { UnitKind } from "./unit-kind";

export interface AdapterUnit<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
> extends BaseUnit<TRequiredUnits, TOptionalUnits> {
  kind: UnitKind.ADAPTER;
  dev(project: Project, ctx: AdapterDevContext<TRequiredUnits, TOptionalUnits>): Promise<DevServerResult>;
  build(project: Project, ctx: AdapterBuildContext<TRequiredUnits, TOptionalUnits>): Promise<void>;
}
