import { z } from "zod";

import { PackageKind } from "../../../types";

export const velnoraAppConfigSchema = z.object({
  kind: z.enum(Object.values(PackageKind).filter(v => v !== PackageKind.Unknown)),
  runtime: z.string().optional(),
  basePath: z.union([z.string(), z.function({ input: [z.string()], output: z.string() })]).optional()
});

export interface VelnoraAppConfig {
  kind: PackageKind;
  runtime?: string;
  basePath?: string | ((version: string) => string);
}
