import type { WatchOptions } from "vite";
import { z } from "zod";

export const serverSchema = z.object({
  host: z.string().optional(),
  port: z.number().optional(),
  watch: z.custom<WatchOptions>().optional()
});
