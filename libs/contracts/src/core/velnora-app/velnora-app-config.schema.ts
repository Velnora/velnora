import { z } from "zod";

import { PackageKind } from "@velnora/types";

import { nullishObject } from "../../utils/nullish-object";
import { clientSchema } from "./client.schema";
import { serverSchema } from "./server.schema";

export const velnoraAppConfigSchema = z.object({
  kind: z.enum(Object.values(PackageKind).filter(v => v !== PackageKind.Unknown)).optional(),
  runtime: z.string().optional(),
  integrations: z.record(z.string(), z.any()).optional().default({}),

  client: z.preprocess(nullishObject, clientSchema),
  server: z.preprocess(nullishObject, serverSchema)
});
