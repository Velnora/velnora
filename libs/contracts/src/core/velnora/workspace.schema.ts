import { z } from "zod";

export const workspaceSchema = z.object({
  provider: z.enum(["nx", "velnora"]).default("velnora").optional()
});
