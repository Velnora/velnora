import { z } from "zod";

export const appsSchema = z.object({
  hostApp: z.string().optional().default("host"),
  csrAppRedirectToIndexHtml: z.boolean().optional().default(true)
});
