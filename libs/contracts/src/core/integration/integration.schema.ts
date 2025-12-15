import { z } from "zod";

import type { Integration } from "@velnora/types";

export const integrationSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  vite: z.custom<Integration["vite"]>().optional(),

  apply: z.custom<Integration["apply"]>(),
  configure: z.custom<Integration["configure"]>(),
  scaffold: z.custom<Integration["scaffold"]>(),
  build: z.custom<Integration["build"]>(),
  runtime: z.custom<Integration["runtime"]>()
});
