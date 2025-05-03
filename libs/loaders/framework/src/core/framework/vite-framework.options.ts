import type { ViteFrameworkOptions as IViteFrameworkOptions } from "@velnora/types";
import { ClassExtensions, ClassRawValues } from "@velnora/utils";

import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";

@ClassRawValues()
@ClassExtensions()
export class ViteFrameworkOptions extends BaseClass<FrameworkContext> implements IViteFrameworkOptions {}
