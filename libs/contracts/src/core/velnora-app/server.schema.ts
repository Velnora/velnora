import { z } from "zod";

export const serverSchema = z.object({
  url: z
    .string()
    .or(z.function({ input: [z.number().positive()], output: z.string() }))
    .optional()
});
