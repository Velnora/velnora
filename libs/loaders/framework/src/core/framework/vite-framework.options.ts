import type { ViteFrameworkOptions as IViteFrameworkOptions } from "@fluxora/types";
import { ClassExtensions } from "@fluxora/utils";

import { ContainerBaseClass } from "../container-base-class";
import type { FrameworkContext } from "../framework.context";

@ClassExtensions()
export class ViteFrameworkOptions extends ContainerBaseClass<FrameworkContext> implements IViteFrameworkOptions {}
