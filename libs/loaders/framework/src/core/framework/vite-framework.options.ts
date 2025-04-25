import type { ViteFrameworkOptions as IViteFrameworkOptions } from "@fluxora/types";
import { ClassExtensions, ClassRawValues } from "@fluxora/utils";

import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";

@ClassRawValues()
@ClassExtensions()
export class ViteFrameworkOptions extends BaseClass<FrameworkContext> implements IViteFrameworkOptions {}
