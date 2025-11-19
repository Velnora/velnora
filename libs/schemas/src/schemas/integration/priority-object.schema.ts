import { z } from "zod";

import { stageSchema } from "../stage.schema";

export const priorityObjectSchema = z.record(stageSchema, z.number().optional());
export type PriorityObject = Partial<z.infer<typeof priorityObjectSchema>>;
