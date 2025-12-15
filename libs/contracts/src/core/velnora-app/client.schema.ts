import { z } from "zod";

export const clientSchema = z.object({
  url: z.string().optional()
});
