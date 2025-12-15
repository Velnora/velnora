import { z } from "zod";

export const experimentsSchema = z.object({
  rolldown: z.boolean().default(false)
});
