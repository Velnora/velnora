import { resolve } from "node:path";

import { z } from "zod";

import { nullishObject } from "../../utils/nullish-object";
import { integrationSchema } from "../integration";
import { appsSchema } from "./apps-schema";
import { experimentsSchema } from "./experiments.schema";
import { serverSchema } from "./server.schema";

export const velnoraConfigSchema = z.object({
  mode: z.string().optional().default("development"),
  root: z.string().optional().default(process.cwd()),
  apps: z.preprocess(nullishObject, appsSchema),
  server: z.preprocess(nullishObject, serverSchema),
  integrations: z.array(integrationSchema).default([]),
  experiments: z.preprocess(nullishObject, experimentsSchema),

  cacheDir: z
    .string()
    .optional()
    .default(".velnora")
    .transform(p => resolve(p))
    .transform(p => p.replace(new RegExp(`^${resolve(process.cwd())}/`), ""))
});
