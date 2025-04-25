import type { ProjectSettings as IProjectSettings } from "@fluxora/types";
import { ClassExtensions } from "@fluxora/utils";

import { BaseClass } from "../../base-class";

@ClassExtensions()
export class ProjectSettings extends BaseClass implements IProjectSettings {}
