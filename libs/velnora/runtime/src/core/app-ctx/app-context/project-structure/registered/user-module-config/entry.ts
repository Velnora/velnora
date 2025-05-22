import type { Entry as IEntry } from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../../../../base-class";

@ClassRawValues()
@ClassExtensions()
export class Entry extends BaseClass implements IEntry {
  @ClassGetterSetter()
  declare client: string;

  @ClassGetterSetter()
  declare server: string;
}
